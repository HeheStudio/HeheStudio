import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl text-ink font-semibold mb-6">About Hehe Design</h1>
      <p className="text-lg opacity-70 leading-relaxed mb-4">
        Hehe Design lets you design customisable, made-to-measure shelves online.
        Change the size, shelves and materials in 3D and see your design and its
        price update as you go.
      </p>
      <p className="text-lg opacity-70 leading-relaxed mb-8">
        We are based in Southampton, Hampshire, and we are starting with shelves,
        with more furniture and products to come.
      </p>
      <Link to="/" className="text-rust font-semibold hover:underline">
        Browse the shop &rarr;
      </Link>
    </div>
  );
};

export default About;
