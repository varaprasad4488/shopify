const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { Shopify } = require('@shopify/shopify-api');
const puppeteer = require("puppeteer");
const { JSDOM } = require("jsdom");



require('dotenv').config();
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const SHOP_NAME = process.env.SHOP_NAME;
const SCOPES = process.env.SCOPES;                            
const HOST_NAME = process.env.HOST_NAME;

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES,
  SHOP_NAME: SHOP_NAME,
  ACCESS_TOKEN: process.env.SHOPIFY_ACCESS_TOKEN,
  HOST_NAME: process.env.HOST_NAME,
  IS_EMBEDDED_APP: false,
  API_VERSION: "2023-04"
});

app.get("/test", (req, res) => {
  res.send("Working 3D configurator!");
});

app.post('/product/:productId/config', async (req, res) => {
  const { productId } = req.params;
  const { namespace, key, value, type } = req.body;

  if (!productId || !namespace || !key || !value || !type) {
    return res.status(400).json({ error: 'Missing required fields in the request body' });
  }

  try {
    const client = new Shopify.Clients.Rest("quickstart-3a0bbfad.myshopify.com", "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");
    const response = await client.post({
      path: `/admin/api/2023-04/products/${productId}/metafields`,
      data: {
        metafield: {
          namespace,
          key,
          value,
          type, 
        },
      },
      type: 'application/json' 
    });
    res.status(201).json(response.body); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add metafield data' });
  }
});

app.get('/metaobject/:id', async (req, res) => {
  let { id } = req.params;

  if (!id.startsWith('gid://shopify/Metaobject/')) {
    id = `gid://shopify/Metaobject/${id}`; 
  }

  try {
    const client = new Shopify.Clients.Graphql(
      "quickstart-3a0bbfad.myshopify.com",
      "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"
    );

    const query = `
      query GetMetaobject($id: ID!) {
        metaobject(id: $id) {
          id
          type
          fields {
            key
            value
          }
        }
      }
    `;

    const response = await client.query({
      data: {
        query,
        variables: { id },
      },
    });

    res.status(200).json(response.body.data.metaobject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch metaobject data' });
  }
});

// app.get('/product/:productId/config', async (req, res) => {
//   const { productId } = req.params;
//   try {
//     const client = new Shopify.Clients.Rest("quickstart-3a0bbfad.myshopify.com", "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");
//     const response = await client.get({
//       path: `/admin/api/2024-01/products/${productId}/metafields`,
//       query: { namespace: 'custom' },
//     });
//     if (response && response.body) {
//       const metafields = response.body.metafields
//       res.send(metafields);
//     } else {
//       res.status(404).json({ error: 'No metafield data found for the specified product.' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to fetch metafield data' });
//   }
// });

app.get('/product/:productId/config', async (req, res) => {
  const { productId } = req.params;

  try {
    const restClient = new Shopify.Clients.Rest(
      "quickstart-3a0bbfad.myshopify.com",
      "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"
    );

    const graphqlClient = new Shopify.Clients.Graphql(
      "quickstart-3a0bbfad.myshopify.com",
      "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"
    );


    const productResponse = await restClient.get({
      path: `/admin/api/2024-01/products/${productId}/metafields`,
      // query: { namespace: 'custom' },
    });

    if (!productResponse || !productResponse.body.metafields || productResponse.body.metafields.length === 0) {
      return res.status(404).json({ error: 'No metafield data found for the specified product.' });
    }

    const metafields = productResponse.body.metafields;

    
    const metaobjectPromises = metafields
      .filter((mf) => mf.type === 'metaobject_reference') 
      .map(async (mf) => {
        const metaobjectId = mf.value; 

        const metaobjectQuery = `
          query GetMetaobject($id: ID!) {
            metaobject(id: $id) {
              id
              type
              fields {
                key
                value
              }
            }
          }
        `;

        const metaobjectResponse = await graphqlClient.query({
          data: {
            query: metaobjectQuery,
            variables: { id: metaobjectId },
          },
        });

        return {
          metafieldKey: mf.key,
          metafieldId: mf.id,
          metaobject: metaobjectResponse.body.data.metaobject || null,
        };
      });

    // Step 3: Wait for all metaobject data to resolve
    const metaobjectDetails = await Promise.all(metaobjectPromises);

    // Step 4: Combine metafields and metaobject details into a single response
    const result = metafields.map((mf) => {
      if (mf.type === 'metaobject_reference') {
        const metaobject = metaobjectDetails.find((md) => md.metafieldId === mf.id);
        return {
          ...mf,
          metaobject: metaobject ? metaobject.metaobject : null, // Add metaobject details if available
        };
      }
      return mf; // Non-metaobject metafields remain unchanged
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch metafield or metaobject data' });
  }
});



app.get("/product-id/:handle", async (req, res) => {
  const handle = req.params.handle;
  const accessToken = "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"; 

  try {
    const response = await axios.get(
      `https://quickstart-3a0bbfad.myshopify.com/admin/api/2023-04/products.json?handle=${handle}`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json"
        }
      }
    );

    if (response.data.products.length > 0) {
      const productId = response.data.products[0].id;
      res.json({ productId });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error("Error fetching product ID:", error);
    res.status(500).json({ error: "Failed to retrieve product ID" });
  }
});

app.get("/product-info/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    const client = new Shopify.Clients.Rest("quickstart-3a0bbfad.myshopify.com", "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");
    const response = await client.get({
      path: `/admin/api/2023-04/products/${productId}.json`,
    });

    if (response && response.body && response.body.product) {
      const product = response.body.product;
      const title = product.title;
      const price = product.variants[0]?.price;  
      const compareAtPrice = product.variants[0]?.compare_at_price;

      res.json({ title, price, compareAtPrice, product });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error("Error fetching product information:", error);
    res.status(500).json({ error: "Failed to retrieve product information" });
  }
});

app.get("/media-url/:mediaId", async (req, res) => {
  const { mediaId } = req.params;

  const query = `
    query getMediaImage($id: ID!) {
      mediaImage(id: $id) {
        image {
          originalSrc
        }
      }
    }
  `;

  const variables = { id: `gid://shopify/MediaImage/${mediaId}` };

  try {
    const response = await axios.post(
      `https://quickstart-3a0bbfad.myshopify.com/admin/api/2024-01/graphql.json`,
      {
        query,
        variables,
      },
      {
        headers: {
          "X-Shopify-Access-Token": "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",
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data)

    if (
      response.data &&
      response.data.data &&
      response.data.data.mediaImage &&
      response.data.data.mediaImage.image &&
      response.data.data.mediaImage.image.originalSrc
    ) {
      const imageUrl = response.data.data.mediaImage.image.originalSrc;
      res.json({ imageUrl });
    } else {
      res.status(404).json({ error: "Media image not found" });
    }
  } catch (error) {
    console.error("Error fetching media image URL:", error.response?.data || error);
    res.status(500).json({ error: "Failed to fetch media image URL" });
  }
});

app.get('/media-image/:id', async (req, res) => {
  let { id } = req.params;

  // Ensure the ID is in Shopify GID format
  if (!id.startsWith('gid://shopify/MediaImage/')) {
    id = `gid://shopify/MediaImage/${id}`;
  }

  try {
    const client = new Shopify.Clients.Graphql(
      "quickstart-3a0bbfad.myshopify.com",
      "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"
    );

    // GraphQL query to fetch the MediaImage URL
    const query = `
      query GetMediaImage($id: ID!) {
        mediaImage(id: $id) {
          id
          image {
            url
          }
        }
      }
    `;

    // Execute the query
    const response = await client.query({
      data: {
        query,
        variables: { id },
      },
    });

    // Extract the URL
    const mediaImage = response.body.data.mediaImage;
    if (mediaImage && mediaImage.image && mediaImage.image.url) {
      return res.status(200).json({ id: mediaImage.id, url: mediaImage.image.url });
    }

    return res.status(404).json({ error: 'Media image not found or URL unavailable.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch media image URL.' });
  }
});


app.post('/api/materials', (req, res) => {
  const { material } = req.body;

  if (!material) {
    return res.status(400).json({ error: 'Material is required' });
  }

  res.status(200).json({ message: 'Material submitted successfully', material: material });
});

app.post("/update-metaobject", async (req, res) => {
  const {meta_type, materials } = req.body;

  if (!materials || !Array.isArray(materials)) {
    return res.status(400).json({ error: "Invalid materials data" });
  }

  try {
    const response = await axios.post(
      `https://quickstart-3a0bbfad.myshopify.com/admin/api/2024-01/metaobjects.json`,
      {
        metaobject: {
          type: meta_type, 
          fields: {
            material_options: materials,
          },
        },
      },
      {
        headers: {
          "X-Shopify-Access-Token": "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",
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      }
    );
    res.status(200).json({
      message: "Metaobject updated successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error updating metaobject:", error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
});

app.get("/api/solution3D/:solutionID", async (req, res) => {
  // const { solutionID } = req.params;

  const options = {
    distID: "9f361da9-401e-493f-8784-0b608613760a",
    solution3DName: "new-test",
    projectName: "massy-birch",
    solution3DID: "39954",
  };

  try {
    const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, {
      url: "http://localhost",
      runScripts: "dangerously",
      resources: "usable",
    });

    const { window } = dom;

    const script = dom.window.document.createElement("script");
    script.src = "https://distcdn.unlimited3d.com/pres/v/2.11.2/unlimited3d.min.js?ver=6.6.2";


    script.onload = async () => {
      try {
        window.Unlimited3D.init(options);

        const parts = await new Promise((resolve, reject) =>
          window.Unlimited3D.getAvailableParts((error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
        );

        const materials = await new Promise((resolve, reject) =>
          window.Unlimited3D.getAvailableMaterials((error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
        );

        const animationSets = await new Promise((resolve, reject) =>
          window.Unlimited3D.getAvailableAnimationSets((error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
        );
        res.status(200).json({ parts, materials, animationSets });
      } catch (error) {
        console.error("Error fetching 3D data:", error);
        res.status(500).json({ error: "Failed to fetch 3D data." });
      }
    };

    // Append the script to the DOM
    dom.window.document.body.appendChild(script);
  } catch (error) {
    console.error("Error initializing Unlimited3D:", error);
    res.status(500).json({ error: "Failed to initialize Unlimited3D." });
  }
});

app.post('/product/:productId/metafields/information', async (req, res) => {
  const { productId } = req.params;
  const { value } = req.body;

  if (!productId || !value) {
    return res.status(400).json({ error: 'Product ID and metafield value are required' });
  }

  try {
    const client = new Shopify.Clients.Rest("quickstart-3a0bbfad.myshopify.com", "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");
    
    const response = await client.post({
      path: `/admin/api/2023-04/products/${productId}/metafields`,
      data: {
        metafield: {
          namespace: 'custom',
          key: 'information',
          type: 'json',
          value: JSON.stringify(value)
        },
      },
      type: 'application/json'
    });

    res.status(200).json(response.body);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update metafield' });
  }
});


app.post('/api/:productId/config', async (req, res) => {
  const { productId } = req.params;
  const { namespace, key, value, type } = req.body;

  if (!productId || !namespace || !key || !value || !type) {
    return res.status(400).json({ error: 'Missing required fields in the request body' });
  }

  try {
    const client = new Shopify.Clients.Rest("quickstart-3a0bbfad.myshopify.com", "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");

    // Fetch existing metafields for the product
    const existingMetafields = await client.get({
      path: `/admin/api/2023-04/products/${productId}/metafields`,
    });

    // Find the metafield that matches the namespace and key
    const metafieldToUpdate = existingMetafields.body.metafields.find(
      metafield => metafield.namespace === namespace && metafield.key === key
    );

    if (metafieldToUpdate) {
      // If metafield exists, update it
      const response = await client.put({
        path: `/admin/api/2023-04/products/${productId}/metafields/${metafieldToUpdate.id}`,
        data: {
          metafield: {
            namespace,
            key,
            value,
            type,
          },
        },
        type: 'application/json',
      });
      res.status(200).json(response.body);
    } else {
      // If metafield does not exist, create it
      const response = await client.post({
        path: `/admin/api/2023-04/products/${productId}/metafields`,
        data: {
          metafield: {
            namespace,
            key,
            value,
            type,
          },
        },
        type: 'application/json',
      });
      res.status(201).json(response.body);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add or update metafield data' });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});