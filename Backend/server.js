// server.js
import express from "express";
import cors from "cors";
import pkg from "pg";
import "dotenv/config";
import OpenAI from "openai";
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';


const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());





cloudinary.config({ 
  cloud_name: process.env.Root,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// UPLOAD IMAGE ROUTE
app.post("/api/upload-image", upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'watches' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    res.json({ 
      success: true, 
      url: result.secure_url 
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to upload image" });
  }
});



// ----- DATABASE CONNECTION -----
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, 
});

pool.connect()
  .then(() => console.log("✅ Connected to Render PostgreSQL"))
  .catch(err => console.error("❌ Database connection error:", err));

// ----- ROUTES -----

// Test route
app.get("/", (req, res) => {
  res.send("Watch API is running");
});

// CREATE a watch
app.post("/api/watches", async (req, res) => {
  try {
    const { brand, model, price, description, image_url } = req.body;

    const result = await pool.query(
      `INSERT INTO watches (brand, model, price, description, image_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [brand, model, price, description, image_url || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Create error:", err);
    res.status(500).json({ error: "Failed to create watch" });
  }
});

// READ all watches
app.get("/api/watches", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM watches ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Read error:", err);
    res.status(500).json({ error: "Failed to fetch watches" });
  }
});

// READ one watch by ID
app.get("/api/watches/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM watches WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Watch not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Read single error:", err);
    res.status(500).json({ error: "Failed to fetch watch" });
  }
});

// UPDATE a watch
app.put("/api/watches/:id", async (req, res) => {
  try {
    const { brand, model, price, description, image_url } = req.body;

    const result = await pool.query(
      `UPDATE watches
       SET brand=$1, model=$2, price=$3, description=$4, image_url=$5
       WHERE id=$6
       RETURNING *`,
      [brand, model, price, description, image_url, req.params.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Watch not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ error: "Failed to update watch" });
  }
});

// DELETE a watch
app.delete("/api/watches/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM watches WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Watch not found" });

    res.json({ message: "Watch deleted" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ error: "Failed to delete watch" });
  }
});

// --------- SMART AI CHATBOX ROUTE ----------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // Get watches from DB
    const dbData = await pool.query("SELECT * FROM watches ORDER BY id DESC");
    const watches = dbData.rows;

    const aiPrompt = `
    User question: ${message}

    Here is the list of watches in the store:
    ${JSON.stringify(watches)}

    Use the watches above to answer the user's question.
    Always recommend watches that exist in the database.
    Keep the response short, friendly, and helpful.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful watch expert." },
        { role: "user", content: aiPrompt },
      ],
    });

    res.json({ reply: completion.choices[0].message.content || "" });
  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({ error: "AI request failed" });
  }
});

// GET cart 
app.get("/api/cart", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT cart_items.id, product_id, quantity, watches.*
      FROM cart_items
      JOIN watches ON watches.id = cart_items.product_id
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Cart fetch error:", err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// ADD to cart 
app.post("/api/cart", async (req, res) => {
  try {
    const { product_id } = req.body;

    // Check if the product already exists in cart
    const existing = await pool.query(
      "SELECT * FROM cart_items WHERE product_id = $1",
      [product_id]
    );

    if (existing.rows.length > 0) {
      const updated = await pool.query(
        `UPDATE cart_items
         SET quantity = quantity + 1
         WHERE product_id = $1
         RETURNING *`,
        [product_id]
      );
      return res.json(updated.rows[0]);
    }

    const result = await pool.query(
      `INSERT INTO cart_items (product_id, quantity)
       VALUES ($1, 1)
       RETURNING *`,
      [product_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

// INCREASE cart item quantity
app.put("/api/cart/increase/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE cart_items
       SET quantity = quantity + 1
       WHERE id = $1
       RETURNING *`,
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Increase qty error:", err);
    res.status(500).json({ error: "Failed to increase quantity" });
  }
});

// DECREASE cart item quantity
app.put("/api/cart/decrease/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE cart_items
       SET quantity = quantity - 1
       WHERE id = $1
       RETURNING *`,
      [req.params.id]
    );

    if (result.rows[0].quantity <= 0) {
      await pool.query("DELETE FROM cart_items WHERE id = $1", [
        req.params.id,
      ]);
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Decrease qty error:", err);
    res.status(500).json({ error: "Failed to decrease quantity" });
  }
});

// REMOVE cart item
app.delete("/api/cart/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM cart_items WHERE id = $1", [
      req.params.id,
    ]);
    res.json({ message: "Item removed" });
  } catch (err) {
    console.error("Remove cart item error:", err);
    res.status(500).json({ error: "Failed to remove item" });
  }
});

// CLEAR cart 
app.delete("/api/cart", async (req, res) => {
  try {
    await pool.query("DELETE FROM cart_items");
    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

// ----- START SERVER -----
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));