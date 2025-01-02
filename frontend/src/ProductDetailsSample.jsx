import React, { useEffect, useState } from "react";

const ProductDetailSample = () => {
  const [price, setPrice] = useState(8);
  const [partPrice, setPartPrice] = useState(10);
  const [selectedPart, setSelectedPart] = useState("Double_Breasted_Patch_Pocket"); 
  const [selectedMaterial, setSelectedMaterial] = useState("502"); 

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://distcdn.unlimited3d.com/pres/v/2.11.2/unlimited3d.min.js";
    script.async = true;
    script.onload = () => {
      const options = {
        distID: "9f361da9-401e-493f-8784-0b608613760a",
        solution3DName: "new-test",
        projectName: "massy-birch",
        solution3DID: "39954",
        containerID: "container3d_replace",
      };
      window.Unlimited3D.init(options);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const changeAnimation = (partName, transitionName) => {
    setSelectedPart(partName);
    if (transitionName) {
      window.Unlimited3D.activateTransition({
        transition: transitionName,
      });
    }
  };

  const changeMaterial = (materialName, partPrice) => {
    const partName = selectedPart;
    setSelectedMaterial(materialName);
    window.Unlimited3D.changeMaterial({
      parts: [partName],
      material: materialName,
    });
    setPrice((prev) => prev + partPrice);
  };
  
  const totalPrice = price + partPrice

  return (
    <div className="flex flex-row justify-around h-screen bg-gray-100 items-start">
      {/* 3D Configurator */}
      <div className="w-3/5 flex justify-center items-center m-4 rounded-md">
        <div id="container3d_replace" className="w-full h-[450px]"></div>
      </div>

      {/* Sidebar */}
      <div className="w-[400px] bg-gray-200 shadow-lg m-4 rounded-md h-[450px] p-4 text-white bg-black">
        <h2 className="text-lg font-bold mb-4">Select Part</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            className={`${
              selectedPart === "Double_Breasted_Patch_Pocket" ? "bg-pink-700" : "bg-gray-500"
            } text-white px-4 py-2 rounded`}
            onClick={() =>
              changeAnimation("Double_Breasted_Patch_Pocket", "Transition_pockets_style")
            }
          >
            Pocket
            <p className="text-[10px]">(+$10.00)</p>
          </button>
          <button
            className={`${
              selectedPart === "Single_AndDouble_Breasted_v2" ? "bg-pink-700" : "bg-gray-500"
            } text-white px-4 py-2 rounded`}
            onClick={() =>
              changeAnimation("Single_AndDouble_Breasted_v2", "Transition_button_style")
            }
          >
            Button <p className="text-[10px]">(+$20.00)</p>
          </button>
          <button
            className={`${
              selectedPart === "Single_AndDouble_Breasted_v2_Stetches13" ? "bg-pink-700" : "bg-gray-500"
            } text-white px-4 py-2 rounded`}
            onClick={() =>
              changeAnimation("Single_AndDouble_Breasted_v2_Stetches13", "Transition_elbow_patches")
            }
          >
            Elbow <p className="text-[10px]">(+$30.00)</p>
          </button>
          <button
            className={`${
              selectedPart === "polySurface9Single_Breasted_Back_Outside" ? "bg-pink-700" : "bg-gray-500"
            } text-white px-4 py-2 rounded`}
            onClick={() =>
              changeAnimation("polySurface9Single_Breasted_Back_Outside", "Transition_back_vent_style")
            }
          >
            Back <p className="text-[10px]">(+$40.00)</p>
          </button>
        </div>

        <h2 className="text-lg font-bold mb-4 text-[#000]">Select Material</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: "502", price: 8, img: "https://taos.digital/wp-content/uploads/2024/10/502.jpg" },
            { id: "504", price: 10, img: "https://taos.digital/wp-content/uploads/2024/10/504.jpg" },
            { id: "505", price: 11, img: "https://taos.digital/wp-content/uploads/2024/10/505.jpg" },
            { id: "506", price: 12, img: "https://taos.digital/wp-content/uploads/2024/10/506.jpg" },
            { id: "507", price: 14, img: "https://taos.digital/wp-content/uploads/2024/10/507.jpg" },
            { id: "508", price: 14, img: "https://taos.digital/wp-content/uploads/2024/10/508.jpg" },
          ].map(({ id, price, img }) => (
            <button
            key={id}
            className={`relative ${
              selectedMaterial === id ? "border-4 border-blue-500" : "border-2 border-gray-700"
            } p-1 rounded-full`}
            onClick={() => changeMaterial(id, price)}
          >
            <img src={img} alt={`Material ${id}`} className="h-12 w-12 rounded-full" />
            <div
              className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold"
              style={{ borderRadius: "50%", background: "transparent", opacity: 0.5 }}
            >
              +${price}
            </div>
          </button>          
          ))}
        </div>
        <h2 className="text-lg font-bold text-[#000]">Price</h2>
        <p className="text-2xl font-bold text-[#000]">${totalPrice.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductDetailSample;
