import { Link } from "react-router-dom";
import productsData from "./productsData";

const steps = [
  { title: "Design", text: "Set the size, shelves and materials in the 3D configurator." },
  { title: "Check the price", text: "The price updates as you change your design." },
  { title: "Order", text: "Pay securely by card through Stripe. We deliver within the UK." },
];

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group block border border-gray-200 rounded-md overflow-hidden transition duration-200 hover:border-ink"
    >
      <img
        src={product.mainImage}
        alt={product.title}
        className="w-full h-[320px] md:h-[420px] object-contain bg-white"
      />
      <div className="p-6 border-t border-gray-200">
        <h3 className="text-2xl text-ink font-semibold mb-2">{product.title}</h3>
        <p className="opacity-70 leading-relaxed mb-4">{product.summary}</p>
        <span className="text-rust font-semibold group-hover:underline">Design yours &rarr;</span>
      </div>
    </Link>
  );
};

const Home = () => {
  return (
    <div>
      {/* Intro */}
      <section className="max-w-3xl mx-auto px-4 pt-10 pb-16 md:pt-16 md:pb-20 text-center">
        <h1 className="text-4xl md:text-6xl text-ink font-semibold leading-tight mb-6">
          Design customisable shelves online
        </h1>
        <p className="text-lg md:text-xl opacity-70 leading-relaxed mb-8">
          Made-to-measure shelving, designed by you. More furniture and products to come.
        </p>
        <Link
          to={`/products/${productsData[0].id}`}
          className="inline-block bg-rust text-white font-semibold px-8 py-3 rounded-md transition duration-200 hover:bg-ink"
        >
          Start designing
        </Link>
      </section>

      {/* Products */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <h2 className="text-2xl text-ink font-semibold mb-6">Shop</h2>
        <div className="grid gap-8">
          {productsData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-cream px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl text-ink font-semibold mb-8">How it works</h2>
          <ol className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title}>
                <p className="text-rust font-semibold mb-2">{index + 1}</p>
                <h3 className="text-lg text-ink font-semibold mb-2">{step.title}</h3>
                <p className="opacity-70 leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
};

export default Home;
