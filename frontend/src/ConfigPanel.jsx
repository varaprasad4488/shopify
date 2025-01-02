import React, { useState } from "react";

const ConfigPanel = () => {
  const [options, setOptions] = useState([]);

  const handleAddOption = () => {
    setOptions([
      ...options,
      {
        id: Date.now(),
        optionName: "",
        material: [],
        animation: "",
        image: null,
        types: [],
        isVisible: true,
      },
    ]);
  };

  const handleAddType = (optionId) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === optionId
          ? {
            ...option,
            types: [
              ...option.types,
              {
                id: Date.now(),
                label: "",
                price: "",
                materialIcon: null,
                selectPart: "",
                condition: false,
              },
            ],
          }
          : option
      )
    );
  };

  const handleRemoveOption = (optionId) => {
    setOptions(options.filter((option) => option.id !== optionId));
  };

  const handleRemoveType = (optionId, typeId) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === optionId
          ? {
            ...option,
            types: option.types.filter((type) => type.id !== typeId),
          }
          : option
      )
    );
  };

  const toggleVisibility = (optionId) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === optionId
          ? { ...option, isVisible: !option.isVisible }
          : option
      )
    );
  };

  return (
    <div className="p-8">
      <h2 className="text-lg font-semibold mb-4">Configuration Panel</h2>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={handleAddOption}
      >
        Add New Option
      </button>
      {options.map((option) => (
        <div key={option.id} className="border p-4 rounded mb-4 bg-gray-100">
          <div className="mb-2">
            <label className="block mb-1">Option Name:</label>
            <input
              type="text"
              className="border p-2 w-full"
              value={option.optionName}
              onChange={(e) =>
                setOptions((prevOptions) =>
                  prevOptions.map((opt) =>
                    opt.id === option.id
                      ? { ...opt, optionName: e.target.value }
                      : opt
                  )
                )
              }
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Material:</label>
            <input
              type="text"
              placeholder="Enter materials"
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Animation:</label>
            <input
              type="text"
              placeholder="Enter animations"
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Image:</label>
            <input type="file" />
          </div>
          <div className="flex gap-2 mb-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => handleRemoveOption(option.id)}
            >
              Remove Option
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => toggleVisibility(option.id)}
            >
              {option.isVisible ? "Hide" : "Show"}
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => handleAddType(option.id)}
            >
              Add Type
            </button>
          </div>
          {option.isVisible &&
            option.types.map((type) => (
              <div
                key={type.id}
                className="border p-4 rounded mb-4 bg-white"
              >
                <div className="mb-2">
                  <label className="block mb-1">Option Label:</label>
                  <input
                    type="text"
                    className="border p-2 w-full"
                    value={type.label}
                    onChange={(e) =>
                      setOptions((prevOptions) =>
                        prevOptions.map((opt) =>
                          opt.id === option.id
                            ? {
                              ...opt,
                              types: opt.types.map((t) =>
                                t.id === type.id
                                  ? { ...t, label: e.target.value }
                                  : t
                              ),
                            }
                            : opt
                        )
                      )
                    }
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1">Price:</label>
                  <input
                    type="text"
                    className="border p-2 w-full"
                    value={type.price}
                    onChange={(e) =>
                      setOptions((prevOptions) =>
                        prevOptions.map((opt) =>
                          opt.id === option.id
                            ? {
                              ...opt,
                              types: opt.types.map((t) =>
                                t.id === type.id
                                  ? { ...t, price: e.target.value }
                                  : t
                              ),
                            }
                            : opt
                        )
                      )
                    }
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1">Select Part:</label>
                  <input
                    type="text"
                    className="border p-2 w-full"
                    value={type.price}
                    onChange={(e) =>
                      setOptions((prevOptions) =>
                        prevOptions.map((opt) =>
                          opt.id === option.id
                            ? {
                              ...opt,
                              types: opt.types.map((t) =>
                                t.id === type.id
                                  ? { ...t, price: e.target.value }
                                  : t
                              ),
                            }
                            : opt
                        )
                      )
                    }
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1">Material Icon:</label>
                  <input type="file" />
                </div>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => handleRemoveType(option.id, type.id)}
                >
                  Remove Type
                </button>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default ConfigPanel;
