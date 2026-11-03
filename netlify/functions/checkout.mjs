import Stripe from "stripe";

// Creates a Stripe Checkout for a shelf configured in the ShapeDiver App Builder.
// The price comes from the App Builder "Add to cart" action in the browser, so it
// is only checked against MIN_PRICE/MAX_PRICE here. Review each order with the
// "Check configuration" link saved on the payment before making the shelf.

const PRODUCT_NAME = "HEHE Custom Shelf";
const CONFIGURATOR_URL =
  "https://appbuilder.shapediver.com/v1/main/latest/?slug=261025-shopify-3";
const CURRENCY = "gbp";
const SHIPPING_COUNTRIES = ["GB"];

const MIN_PRICE = Number(process.env.MIN_PRICE ?? 50);
const MAX_PRICE = Number(process.env.MAX_PRICE ?? 5000);

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export default async (req) => {
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  const body = await req.json().catch(() => ({}));
  const { modelStateId, imageUrl, description } = body;
  const price = Number(body.price);

  if (typeof modelStateId !== "string" || !/^[\w-]{1,100}$/.test(modelStateId)) {
    return json(400, { error: "Missing or invalid configuration" });
  }
  if (!(price >= MIN_PRICE && price <= MAX_PRICE)) {
    console.error("Price outside allowed range", { modelStateId, price });
    return json(400, { error: "This configuration can't be ordered online, please contact us" });
  }

  try {
    const origin = new URL(req.url).origin;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const checkUrl = `${CONFIGURATOR_URL}&modelStateId=${modelStateId}`;
    const metadata = {
      modelStateId,
      quotedPrice: price.toFixed(2),
      checkConfiguration: checkUrl,
    };

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
              description:
                (typeof description === "string" && description.slice(0, 300)) ||
                `Configuration ${modelStateId}`,
              ...(typeof imageUrl === "string" &&
                imageUrl.startsWith("https://") && { images: [imageUrl] }),
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
  }
};
