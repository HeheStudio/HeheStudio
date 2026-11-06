import { Link } from "react-router-dom"
import logo from "/logo.png"

const Navbar = () => {
  return (
    <nav className="px-4 md:px-9 py-4 md:py-6 flex flex-wrap justify-between items-center gap-x-6 gap-y-2">
      {/* Logo and name */}
      <Link to="/" className="flex items-center gap-3 text-ink">
        <img className="w-14 h-14 md:w-20 md:h-20" src={logo} alt="" />
        <span className="text-2xl md:text-4xl font-normal tracking-wider">
          <span className="font-semibold">H</span>e<span className="font-semibold">h</span>e <span className="font-semibold">Design</span>
        </span>
      </Link>

      {/* Links */}
      <div className="flex gap-6 text-lg text-ink">
        <Link to="/" className="hover:text-rust">Shop</Link>
        <Link to="/about" className="hover:text-rust">About</Link>
        <Link to="/contact" className="hover:text-rust">Contact</Link>
      </div>
    </nav>
  )
}

export default Navbar
