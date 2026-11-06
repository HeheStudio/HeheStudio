import { Link } from "react-router-dom";

// Stripe sends customers here after a successful payment
const OrderSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-4">
      <h1 className="text-3xl font-semibold mb-4">Thank you for your order</h1>
      <p className="text-gray-600 max-w-md mb-8">
        Your payment was successful. We have emailed you a receipt and will be in
        touch about production and delivery of your shelf.
      </p>
      <Link to="/" className="btn">
        Back to the shop
      </Link>
    </div>
  );
};

export default OrderSuccess;
