import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full px-20 py-5 flex justify-center items-center bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between gap-10 w-full max-w-6xl">
        <Link to="/" className="text-2xl font-bold text-gray-900">Watch US Go</Link>

        <ul className="hidden md:flex list-none gap-8 items-center">
          <li><Link to="/" className="text-base font-medium text-gray-700 hover:text-primary transition">Home</Link></li>
          <li><Link to="/shop" className="text-base font-medium text-gray-700 hover:text-primary transition">Shop</Link></li>
          <li><Link to="/about" className="text-base font-medium text-gray-700 hover:text-primary transition">About</Link></li>
          <li><Link to="/contact" className="text-base font-medium text-gray-700 hover:text-primary transition">Contact</Link></li>
        </ul>

        <div className="flex items-center gap-5">
          <Link to="/cart" className="text-sm text-gray-700 hover:text-primary transition">Cart</Link>
          <Link to="/login" className="text-sm text-gray-700 hover:text-primary transition">Login</Link>
        </div>
      </div>
    </nav>
  );
}