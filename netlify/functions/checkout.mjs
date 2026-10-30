import Stripe from "stripe";
import {
  Configuration,
  ModelStateApi,
  SessionApi,
  UtilsApi,
} from "@shapediver/sdk.geometry-api-sdk-v2";

// Creates a Stripe Checkout for a shelf configured in the ShapeDiver App Builder.
// The browser only sends the model state id (the saved configuration).
// The price is recomputed here by ShapeDiver, so it can't be tampered with.

const PRODUCT_NAME = "HEHE Custom Shelf";
const CURRENCY = "gbp";
const SHIPPING_COUNTRIES = ["GB"];

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

// Find the price of the App Builder "Add to cart" action inside the AppBuilder output
const findAddToCartPrice = (node) => {
  if (!node || typeof node !== "object") return undefined;
  if (node.type === "addToCart") {
    const price = node.props?.price ?? node.price;
    if (price !== undefined) return Number(price);
  }
  for (const value of Object.values(node)) {
    const price = findAddToCartPrice(value);
    if (price !== undefined) return price;
  }
  return undefined;
};

const parseData = (data) => {
  if (typeof data !== "string") return data;
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
};

const getPrice = (outputs) => {
  const list = Object.values(outputs ?? {});

  // Optional: read the price from a dedicated Grasshopper output instead
  const priceOutputName = process.env.SHAPEDIVER_PRICE_OUTPUT;
  if (priceOutputName) {
    const output = list.find((o) => o.name === priceOutputName);
    return Number(parseData(output?.content?.[0]?.data));
  }

  const appBuilder = list.find((o) => o.name === "AppBuilder");
  return findAddToCartPrice(appBuilder?.content?.map((c) => parseData(c.data)));
};

export default async (req) => {
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  const { modelStateId } = await req.json().catch(() => ({}));
  if (typeof modelStateId !== "string" || !modelStateId) {
    return json(400, { error: "Missing modelStateId" });
  }

  const config = new Configuration({ basePath: process.env.SHAPEDIVER_MODEL_VIEW_URL });
  const sessionApi = new SessionApi(config);
  let sessionId;

  try {
    // Load the customer's saved configuration and recompute the model with it
    const session = await sessionApi.createSessionByTicket(process.env.SHAPEDIVER_BACKEND_TICKET);
    sessionId = session.sessionId;

    const { modelState } = await new ModelStateApi(config).getModelState(modelStateId);
    if (modelState.modelId !== session.model.id) {
      return json(400, { error: "This configuration belongs to a different model" });
    }

    const result = await new UtilsApi(config).submitAndWaitForOutput(
      sessionId,
      modelState.parameters,
      undefined,
      true
    );

    const price = getPrice(result.outputs);
    if (!Number.isFinite(price) || price <= 0) {
      console.error("No valid price found in ShapeDiver outputs", price);
      return json(500, { error: "Could not calculate the price for this configuration" });
    }

    const origin = new URL(req.url).origin;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const metadata = { modelStateId };

    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          adjustable_quantity: { enabled: true, minimum: 1, maximum: 10 },
          price_data: {
            currency: CURRENCY,
            unit_amount: Math.round(price * 100),
            product_data: {
              name: PRODUCT_NAME,
              description: `Configuration ${modelStateId}`,
              ...(modelState.imageUrl && { images: [modelState.imageUrl] }),
            },
          },
        },
      ],
      shipping_address_collection: { allowed_countries: SHIPPING_COUNTRIES },
      phone_number_collection: { enabled: true },
      metadata,
      payment_intent_data: { metadata },
      success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
    });

    return json(200, { id: checkout.id, url: checkout.url });
  } catch (error) {
    console.error("Checkout failed", error);
    return json(500, { error: "Checkout failed, please try again" });
  } finally {
    if (sessionId) sessionApi.closeSession(sessionId).catch(() => {});
  }
};
