import { Link, useParams } from "react-router-dom";
import productsData from "./productsData";
import ShapeDiverAppIframe from "./ShapeDiverAppIframe";

const Product = () => {
  const { productId } = useParams();
  const product = productsData.find((item) => item.id === productId);

  if (!product) {
    return (
      <div className="text-center py-24 px-4">
        <h1 className="text-3xl text-ink font-semibold mb-4">Product not found</h1>
        <Link to="/" className="text-rust font-semibold hover:underline">
          Back to the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-9 pb-16">
      <h1 className="text-3xl md:text-4xl text-ink font-semibold mb-2">{product.title}</h1>
      <p className="opacity-70 leading-relaxed max-w-3xl mb-6">{product.summary}</p>
      <div className="h-[85vh] min-h-[640px] bg-gray-100 rounded-md overflow-hidden">
        <ShapeDiverAppIframe
          src={product.shapediverApp.My_App_URL}
          checkout={product.shapediverApp.checkout}
        />
      </div>
    </div>
  );
};

export default Product;
