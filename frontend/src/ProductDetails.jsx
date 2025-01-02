import { useState, useEffect } from "react";
import axios from "axios"
import { RingLoader } from "react-spinners";
import { PacmanLoader } from "react-spinners"


function ProductDetails() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [additionalPrice, setAdditionalPrice] = useState(0);
  const [basePrice] = useState(200);
  const [loading, setLoading] = useState(true);
  const [is3DProduct, setIs3DProduct] = useState(true);
  const [productInfo, setProductInfo] = useState({
    title: '',
    price: '',
    compareAtPrice: ''
  });
  const [options, setOptions] = useState({
    distID: "",
    solution3DName: "",
    projectName: "",
    solution3DID: "",
    containerID: "container3d_replace"
  });
  const [parts, setParts] = useState(null)
  const [materials, setMaterials] = useState(null)
  const [configData, setConfigData] = useState({
    parts: [],
    materials: {},
    animations: []
  });

  // const fetch3DData = () => {
  //   if (window.Unlimited3D) {
  //     window.Unlimited3D.getAvailableParts((error, partsResult) => {
  //       if (!error) {
  //         const parts = partsResult.map(part => ({
  //           name: part.name,
  //           shortName: part.shortName,
  //           type: part.type,
  //         }));
  //         window.Unlimited3D.getAvailableMaterials((matError, matResult) => {
  //           if (!matError) {
  //             const materials = matResult.reduce((acc, mat) => {
  //               acc[mat.shortName] = mat;
  //               return acc;
  //             }, {});
  //             window.Unlimited3D.getAvailableAnimationSets((animSetError, animSetResult) => {
  //               console.log(animSetResult)
  //               if (!animSetError) {
  //                 const allAnimations = [];
  //                 const allTransitions = [];
  //                 const fetchAnimationsForSet = (index) => {
  //                   if (index < animSetResult.length) {
  //                     const animationSet = animSetResult[index].name;
  //                     window.Unlimited3D.getAvailableAnimationStates({ animationSet }, (animError, animResult) => {
  //                       if (!animError) {
  //                         allAnimations.push(
  //                           ...animResult.map(anim => ({
  //                             name: anim.name,
  //                             shortName: anim.shortName,
  //                             type: anim.type,
  //                             animationSetName: animationSet,
  //                           }))
  //                         );
  //                       }
  //                       window.Unlimited3D.getAvailableAnimationTransitions({ animationSet }, (transError, transResult) => {
  //                         if (!transError) {
  //                           allTransitions.push(
  //                             ...transResult.map(trans => ({
  //                               name: trans.name,
  //                               shortName: trans.shortName,
  //                               type: trans.type,
  //                               animationSetName: animationSet,
  //                             }))
  //                           );
  //                         }
  //                         fetchAnimationsForSet(index + 1);
  //                       });
  //                     });
  //                   } else {
  //                     setConfigData({ parts, materials, animations: allAnimations, transitions: allTransitions });
  //                   }
  //                 };
  //                 fetchAnimationsForSet(0);
  //               }
  //             });
  //           }
  //         });
  //       }
  //     });
  //   }
  // };


  const fetch3DData = () => {
    if (!window.Unlimited3D) {
      console.error("Unlimited3D is not available on the window object.");
      return;
    }

    window.Unlimited3D.getAvailableAnimationSets((error, result) => {
      if (error) {
        console.error("Error fetching animation sets:", error);
      } else {
        console.log("Fetched animation sets:", result);
      }
    });
    
  
    (async () => {
      try {
        const parts = await new Promise((resolve, reject) =>
          window.Unlimited3D.getAvailableParts((error, result) => {
            if (error) reject(error);
            else resolve(
              result.map(part => ({
                name: part.name,
                shortName: part.shortName,
                type: part.type,
              }))
            );
          })
        );
  
        const materials = await new Promise((resolve, reject) =>
          window.Unlimited3D.getAvailableMaterials((error, result) => {
            if (error) reject(error);
            else resolve(
              result.reduce((acc, mat) => {
                acc[mat.shortName] = mat;
                return acc;
              }, {})
            );
          })
        );

        const animationSets = await new Promise((resolve, reject) =>
          window.Unlimited3D.getAvailableAnimationSets((error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
        );
  
        const allAnimations = [];
        const allTransitions = [];
  
        for (const set of animationSets) {
          const animationSetName = set.name;
  
          const animations = await new Promise((resolve, reject) =>
            window.Unlimited3D.getAvailableAnimationStates({ animationSet: animationSetName }, (error, result) => {
              if (error) reject(error);
              else resolve(
                result.map(anim => ({
                  name: anim.name,
                  shortName: anim.shortName,
                  type: anim.type,
                  animationSetName,
                }))
              );
            })
          );
  
          const transitions = await new Promise((resolve, reject) =>
            window.Unlimited3D.getAvailableAnimationTransitions({ animationSet: animationSetName }, (error, result) => {
              if (error) reject(error);
              else resolve(
                result.map(trans => ({
                  name: trans.name,
                  shortName: trans.shortName,
                  type: trans.type,
                  animationSetName,
                }))
              );
            })
          );
  
          allAnimations.push(...animations);
          allTransitions.push(...transitions);
        }

        setConfigData({
          parts,
          materials,
          animations: allAnimations,
          transitions: allTransitions,
        });
  

      } catch (error) {
        console.error("Error fetching 3D data:", error);
      }
    })();
  };

  useEffect(() => {
    if (options.distID && options.solution3DName && options.projectName && options.solution3DID) {
      if (window.Unlimited3D) {
        window.Unlimited3D.init(options);
        setTimeout(() => {
          fetch3DData();
        }, 1500);
      } else {
        const script = document.createElement("script");
        script.src = "https://distcdn.unlimited3d.com/pres/v/2.11.2/unlimited3d.min.js?ver=6.6.2";
        script.onload = () => {
          window.Unlimited3D.init(options);
          setTimeout(() => {
            fetch3DData();
          }, 1500);
        };
        document.body.appendChild(script);
      }
    }
  }, [options]);


  console.log(configData)

  useEffect(() => {
    setLoading(true);
    // const handle = window.location.pathname.split("/").pop();
    const handle = "jacket";
    axios.get(`https://shopify-backend-1.onrender.com/product-id/${handle}`)
      .then((response) => {
        const productId = response.data.productId;
        axios.get(`https://shopify-backend-1.onrender.com/product-info/${productId}`)
          .then((productResponse) => {
            const productData = productResponse.data;
            setProductInfo({
              title: productData.title,
              price: productData.price,
              compareAtPrice: productData.compareAtPrice
            });
            axios.get(`http://localhost:3000/product/${productId}/config`)
              .then((configResponse) => {
                const configData = configResponse.data;
                // console.log(configData)
                if (configData.length === 0) {
                  setIs3DProduct(false);
                  setLoading(false);
                  return;
                }
                setOptions({
                  distID: configData.find(item => item.key === 'distID')?.value || "",
                  solution3DName: configData.find(item => item.key === 'solution3DName')?.value || "",
                  projectName: configData.find(item => item.key === 'projectName')?.value || "",
                  solution3DID: configData.find(item => item.key === 'solution3DID')?.value || "",
                  containerID: "container3d_replace"
                });
                const partValues = configData
                  ?.filter(item => item.key.startsWith("part_label"))
                  ?.map(item => item.value);
                const categorizedParts = {};
                partValues?.forEach(part => {
                  categorizedParts[part] = configData
                    .filter(item => item.key.startsWith(`${part}_`))
                    .map(item => item.value);
                });
                setParts(partValues);
                setMaterials(categorizedParts);
                setLoading(false);
              })
              .catch((error) => {
                console.error("Failed to load 3D configuration:", error);
                setIs3DProduct(false);
                setLoading(false);
              });
          })
          .catch((error) => {
            console.error("Failed to load product info:", error);
            setLoading(false);
          });
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          console.error("Product not found:", error);
          setIs3DProduct(false);
        } else {
          console.error("Failed to retrieve product ID:", error);
        }
        setLoading(false);
      });
  }, []);

  const transformPartsData = (partsData) => {
    const transformedParts = {};

    Object.keys(partsData).forEach(partKey => {
      transformedParts[partKey] = partsData[partKey].map(item => {
        const [label, price, dataLabel] = item.split(" - ");
        return { label, price, dataLabel };
      });
    });

    return transformedParts;
  };

  const normalPrice = productInfo && Number(productInfo.price)
  const finalPrice = normalPrice + additionalPrice;
  const finalValues = parts && transformPartsData(materials)

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedOption("");
    setAdditionalPrice(0);
  };

  const handleOptionChange = (option, price) => {
    setSelectedOption(option);
    setAdditionalPrice(price);
    const showLabels = [(finalValues[selectedCategory]?.filter((e) => e.label === option))[0]?.dataLabel]
    const hideLabels = finalValues[selectedCategory]?.filter((e) => e.label !== option).map((e) => e.dataLabel)
    if (selectedCategory) {
      window.Unlimited3D.hideParts({ parts: hideLabels }, () => {
        window.Unlimited3D.showParts({ partObjects: [{ parts: showLabels }] });
        window.Unlimited3D.applyMaterial({ mesh: 502, material: 502 })
      });
    }
  };



  const sendData = async (materials) => {
    try {
      const response = await axios.post(
        'https://quickstart-3a0bbfad.myshopify.com/admin/api/2024-01/metaobjects.json',
        {
          metaobject: {
            type: "test_example", 
            fields: {
              material_options: materials, 
            },
          },
        },
        {
          headers: {
            'X-Shopify-Access-Token': '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', 
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Metaobject updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating metaobject:', error.response?.data || error.message);
    }
  }

  if (!is3DProduct) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen w-full">
        <h1 className="text-[#000] text-3xl font-bold">This is not a 3D Product/Failed to render</h1>
        <p className="text-[#000] text-lg font-semi-bold"> Please check 3D products to view this page!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex flex-row w-full justify-start items-center h-full pl-10 pt-10">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-[500px] w-[800px]">
            <RingLoader color="#4A90E2" size={80} loading={loading} />
            <p className="text-[#000] text-xl"> Loading optimized model... </p>
          </div>
        ) : (
          <div id="container3d_replace" className="h-[500px] w-[800px]"></div>
        )}
      </div>

      <div className="fixed top-[42px] right-0 w-[400px] h-full bg-white shadow-lg p-6 z-50">
        {loading ? (<div className="flex flex-col justify-center items-center gap-3 mt-3">
          <PacmanLoader color="#4A90E2" size={30} loading={loading} />
          <p className="text-[#000] text-xl"> Loading model configurations... </p>
        </div>) : (<div>
          <div className="flex flex-col justify-evenly items-start w-100 min-h-10">
            <h2 className="text-[24px] font-semibold">{productInfo?.title}</h2>
            <h2 className="text-[18px] text-[#918584] font-normal">${normalPrice} <s className="text-[14px]"> {productInfo?.compareAtPrice}</s> USD</h2>
          </div>
          {parts.length !== 0 ? (<div className="mt-2">
            <label className="text-[20px] font-semi-bold mb-2">Select Part</label>
            <div className="flex gap-4">
              {parts.map((cat, i) => (
                <p key={i} className={`px-3 py-2 cursor-pointer ${selectedCategory === cat ? "border-2 border-purple-500 rounded-full" : "rounded-full border-2 border-black-500"}`}
                  onClick={() => handleCategoryChange(cat)}
                >     {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </p>
              ))}
            </div>
          </div>) : (<div>Please Add parts</div>)
          }

          {selectedCategory && (
            <div className="mt-2">
              <label className="block text-[20px] mb-2">Select Material</label>
              <div className="flex gap-2">
                {materials && finalValues[selectedCategory]?.map((material, index) => (
                  <span
                    key={index}
                    className={`text-[12px] cursor-pointer px-4 py-2 border rounded-lg transition-all duration-200 ${selectedOption === material.label ? "border-purple-500 bg-purple-100" : "border-gray-300"
                      }`}
                    onClick={() => handleOptionChange(material?.label, Number((material?.price).slice(1)))}
                  >
                    {material.label} <br /> {material.price}
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="text-[20px] font-normal mt-5">
            Final Price: ${finalPrice.toFixed(2)}
          </p>
          <div className="flex flex-row justify-end items-end w-100 gap-2 mt-2">
            <button className="py-2 px-3 border border-gray-500 rounded bg-[#f3ff34] font-semibold"> Add to cart</button>
            <button className="py-2 px-3 border border-gray-500 rounded bg-[#2839c1] font-semibold text-[#fff]"> Buy it now</button>
          </div>
        </div>)}
      </div>
    </div>
  );
}

export default ProductDetails;
