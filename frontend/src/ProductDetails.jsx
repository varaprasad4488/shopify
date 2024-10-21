import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/products/${id}`
        );
        setProduct(response.data.product);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const cleanString = (str) => {
    const cleaned = str.replace(/<\/?[^>]+(>|$)/g, "").trim();
    return cleaned.endsWith(".") ? cleaned : cleaned + ".";
  };

  useEffect(() => {
    if (product) {
      const options = {
        distID: "49f8d9aa-6f7f-45a4-83b9-8778ecba856c",
        solution3DName: "new-test-2",
        projectName: "massy-birch",
        solution3DID: "39956",
        containerID: "container3d_replace",
      };

      if (window.Unlimited3D) {
        window.Unlimited3D.init(options);
      } else {
        const script = document.createElement("script");
        script.src =
          "https://distcdn.unlimited3d.com/pres/v/2.11.0/unlimited3d.min.js";
        script.onload = () => {
          window.Unlimited3D.init(options);
        };
        document.body.appendChild(script);
      }
    }
  }, [product]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex fle-row w-full justify-evenly items-center h-full">
        <div id="container3d_replace" className="h-[500px] w-[800px]"></div>
        <div className="flex flex-col justify-center border border-red-500 border-solid">
          <div className="border border-green-500 border-solid h-[150px] rounded-full"></div>
          <div className="flex flex-col">
            {product && (
              <>
                <h1 className="text-3xl font-bold">{product.title}</h1>
                <img
                  src={product.images[0]?.src}
                  alt={product.title}
                  className="h-[200px] w-[300px]"
                />
                <p>{cleanString(product.body_html)}</p>
                <p>Actual Price: {product.variants[0]?.price}</p>
                <p>Compare at Price: {product.variants[0]?.compare_at_price}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
