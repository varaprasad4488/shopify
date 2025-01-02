import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductList from "./ProductList";
import ProductDetails from "./ProductDetails";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
 

// import { useState } from "react";
// import axios from "axios";

// function App() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchProducts = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axios.get("http://localhost:3000/api/products");
//       setProducts(response.data);
//     } catch (err) {
//       console.error("Error fetching products:", err);
//       setError("Failed to fetch products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   function cleanString(str) {
//     const cleaned = str.replace(/<\/?[^>]+(>|$)/g, "").trim();
//     return cleaned.endsWith(".") ? cleaned : cleaned + ".";
//   }
//   const productInfo = products?.products?.map((p) => ({
//     title: p.title,
//     body_html: cleanString(p.body_html),
//     Actual_price: p.variants[0]?.price,
//     price: p.variants[0]?.compare_at_price,
//     img_src: p.images[0]?.src,
//   }));
//   console.log(productInfo);

//   return (
//     <div className="flex flex-col h-screen items-center p-2">
//       <h1 className="text-green-500 text-4xl font-bold"> 3D Configurator </h1>
//       <div className="flex flex-col justify-center items-center">
//         <button
//           className="bg-blue-500 text-[#fff] rounded p-2 m-2"
//           onClick={fetchProducts}
//         >
//           Fetch Products
//         </button>
//         {loading && <p>Loading...</p>}
//         {error && <p>{error}</p>}
//         <ul className="flex flex-row justify-center items-center">
//           {products &&
//             productInfo?.map((product) => (
//               <li
//                 key={product?.title}
//                 className="m-2 flex flex-col bg-gray-200 py-2 px-4 justify-center rounded"
//               >
//                 <h1 className="font-bold"> Product </h1>
//                 <img
//                   src={product?.img_src}
//                   className="h-[150px] w-[200px]"
//                   alt="img"
//                 />
//                 {product?.title} - {product?.price}
//                 <p> Actual Price {product?.Actual_price}</p>
//               </li>
//             ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default App;