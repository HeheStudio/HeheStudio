import postRobot from "post-robot";

// Connects to a ShapeDiver App Builder iframe the same way ShapeDiver's
// Shopify/WooCommerce plugins do, so its "Add to cart" button starts a Stripe checkout.
// App Builder calls itself "app" and expects the host page to be "plugin".

const NAME = "plugin";
const PEER_NAME = "app";
const RETRY_MSEC = 100;
const GIVE_UP_MSEC = 20000;

const startCheckout = async ({ modelStateId }) => {
  const res = await fetch("/.netlify/functions/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ modelStateId }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.url) throw new Error(body.error || "Checkout failed, please try again");

  window.location.assign(body.url);
  return { id: body.id, successMessage: "Taking you to secure checkout…" };
};

export const connectAppBuilderCheckout = (iframe) => {
  const win = iframe.contentWindow;
  const domain = new URL(iframe.src).origin;
  const listeners = [];
  const timers = [];

  const listen = (name, handler) =>
    listeners.push(postRobot.on(name, { window: win, domain }, (event) => handler(event.data)));

  // Keep sending a message until App Builder answers it
  const sendUntilAnswered = (name, data) => {
    const id = setInterval(() => {
      postRobot
        .send(win, name, data, { domain, timeout: RETRY_MSEC })
        .then(() => clearInterval(id))
        .catch(() => {});
    }, RETRY_MSEC);
    timers.push(id, setTimeout(() => clearInterval(id), GIVE_UP_MSEC));
  };

  // Ready check and handshake, in both directions
  listen(`${PEER_NAME}API_READY`, () => ({ name: NAME }));
  listen(`${PEER_NAME}:HANDSHAKE`, () => ({}));
  sendUntilAnswered(`${NAME}API_READY`, { name: NAME });
  sendUntilAnswered(`${NAME}:HANDSHAKE`, undefined);

  // Requests App Builder can make to the host page
  listen(`${PEER_NAME}:ADD_ITEM_TO_CART`, startCheckout);
  listen(`${PEER_NAME}:GET_PARENT_PAGE_INFO`, () => ({ href: window.location.href }));
  listen(`${PEER_NAME}:GET_USER_PROFILE`, () => ({ id: "", email: "", name: "" }));
  listen(`${PEER_NAME}:CLOSE_CONFIGURATOR`, () => false);
  listen(`${PEER_NAME}:MESSAGE_TO_PARENT`, () => ({}));

  return () => {
    listeners.forEach((l) => l.cancel());
    timers.forEach((t) => clearInterval(t));
  };
};
