import { createRoot } from "react-dom/client";
import "./index.css";
import ProductDetails from "./ProductDetails.jsx";
import ConfigPanel from "./ConfigPanel.jsx";
import Sample from "./Sample.jsx";
// import ProductDetailSample from "./ProductDetailsSample.jsx";
import ProductDetailsSample from "./ProductDetailsSample.jsx";
 
const rootElement = document.getElementById("root");
window.ProductDetails = ProductDetails;
if (rootElement) {
  createRoot(rootElement).render(<ConfigPanel/>);
}