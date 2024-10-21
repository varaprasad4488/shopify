const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const SHOP_NAME = process.env.SHOP_NAME;

app.get("/test", (req, res) => {
  res.send("Hello, welcome to our simple Express application!");
});

app.get("/api/products", async (req, res) => {
  try {
    const response = await axios.get(
      `https://${SHOP_NAME}.myshopify.com/admin/api/2023-10/products.json`,
      {
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Error fetching products");
  }
});

app.get("/api/products/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const response = await axios.get(
      `https://${SHOP_NAME}.myshopify.com/admin/api/2023-10/products/${productId}.json`,
      {
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).send("Error fetching product details");
  }
});

app.put("/api/products/:id", async (req, res) => {
  const productId = req.params.id;
  const { title, description, price, actual_price } = req.body;

  if (!title && !description && !price && !actual_price) {
    return res
      .status(400)
      .send(
        "At least one field (title, description, price, or actual_price) is required"
      );
  }

  let updateData = { product: {} };

  if (title) updateData.product.title = title;
  if (description) updateData.product.body_html = description;
  if (price || actual_price) {
    updateData.product.variants = [];
    let variantUpdate = {};
    if (price) variantUpdate.price = price;
    if (actual_price) variantUpdate.compare_at_price = actual_price;
    updateData.product.variants.push(variantUpdate);
  }

  try {
    const response = await axios.put(
      `https://${SHOP_NAME}.myshopify.com/admin/api/2023-10/products/${productId}.json`,
      updateData,
      {
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Error updating product");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
