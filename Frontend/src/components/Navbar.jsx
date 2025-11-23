import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <nav style={{
      background: "#222",
      color: "white",
      padding: "12px",
      display: "flex",
      gap: "20px"
    }}>
      <Link to="/" style={{ color: "white" }}>Products</Link>
      <Link to="/add" style={{ color: "white" }}>Add Product</Link>
    </nav>
  );
}

