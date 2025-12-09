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

// ----- DATABASE CONNECTION -----
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, 
});

pool.connect()
  .then(() => console.log("✅ Connected to Render PostgreSQL"))
  .catch(err => console.error("❌ Database connection error:", err));

// ----- HELPER FUNCTION -----
// Helper function to extract username from Authorization header
const getUsername = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7); // Remove 'Bearer ' prefix
  }
  return null;
};

// ----- ROUTES -----

// Test route
app.get("/", (req, res) => {
  res.send("Watch API is running");
});

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

// ========== WATCHES CRUD ==========

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

// Update image URL for a specific watch
app.put("/api/admin/update-image/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { image_url } = req.body;

    if (!image_url) {
      return res.status(400).json({ error: "image_url is required" });
    }

    const result = await pool.query(
      "UPDATE watches SET image_url = $1 WHERE id = $2 RETURNING *",
      [image_url, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Watch not found" });
    }

    res.json({
      message: "Image updated successfully!",
      watch: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating image:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ========== CART ROUTES ==========

// GET cart - now user-specific
app.get("/api/cart", async (req, res) => {
  try {
    const username = getUsername(req);
    if (!username) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await pool.query(`
      SELECT cart_items.id, cart_items.product_id, cart_items.quantity, 
             watches.brand, watches.model, watches.price, watches.description, watches.image_url
      FROM cart_items
      JOIN watches ON watches.id = cart_items.product_id
      WHERE cart_items.username = $1
      ORDER BY cart_items.created_at DESC
    `, [username]);

    res.json(result.rows);
  } catch (err) {
    console.error("Cart fetch error:", err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// ADD to cart - now user-specific
app.post("/api/cart", async (req, res) => {
  try {
    const username = getUsername(req);
    if (!username) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    // Check if the product already exists in user's cart
    const existing = await pool.query(
      "SELECT * FROM cart_items WHERE username = $1 AND product_id = $2",
      [username, product_id]
    );

    if (existing.rows.length > 0) {
      // Update existing cart item
      const updated = await pool.query(
        `UPDATE cart_items
         SET quantity = quantity + $1
         WHERE username = $2 AND product_id = $3
         RETURNING *`,
        [quantity, username, product_id]
      );
      return res.json(updated.rows[0]);
    }

    // Insert new cart item
    const result = await pool.query(
      `INSERT INTO cart_items (username, product_id, quantity)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [username, product_id, quantity]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

// INCREASE cart item quantity - now user-specific
app.put("/api/cart/increase/:product_id", async (req, res) => {
  try {
    const username = getUsername(req);
    if (!username) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await pool.query(
      `UPDATE cart_items
       SET quantity = quantity + 1
       WHERE username = $1 AND product_id = $2
       RETURNING *`,
      [username, req.params.product_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Increase qty error:", err);
    res.status(500).json({ error: "Failed to increase quantity" });
  }
});

// DECREASE cart item quantity - now user-specific
app.put("/api/cart/decrease/:product_id", async (req, res) => {
  try {
    const username = getUsername(req);
    if (!username) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await pool.query(
      `UPDATE cart_items
       SET quantity = quantity - 1
       WHERE username = $1 AND product_id = $2
       RETURNING *`,
      [username, req.params.product_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    // If quantity is now 0, delete the item
    if (result.rows[0].quantity <= 0) {
      await pool.query(
        "DELETE FROM cart_items WHERE username = $1 AND product_id = $2",
        [username, req.params.product_id]
      );
      return res.json({ message: "Item removed from cart", quantity: 0 });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Decrease qty error:", err);
    res.status(500).json({ error: "Failed to decrease quantity" });
  }
});

// REMOVE cart item - now user-specific
app.delete("/api/cart/:product_id", async (req, res) => {
  try {
    const username = getUsername(req);
    if (!username) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await pool.query(
      "DELETE FROM cart_items WHERE username = $1 AND product_id = $2 RETURNING *",
      [username, req.params.product_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.json({ message: "Item removed" });
  } catch (err) {
    console.error("Remove cart item error:", err);
    res.status(500).json({ error: "Failed to remove item" });
  }
});

// CLEAR cart - now user-specific
app.delete("/api/cart", async (req, res) => {
  try {
    const username = getUsername(req);
    if (!username) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await pool.query("DELETE FROM cart_items WHERE username = $1", [username]);
    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

// ========== PAYMENT CARDS ROUTES ==========

// GET all cards for a user
app.get("/api/cards", async (req, res) => {
  try {
    const username = getUsername(req);
    if (!username) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await pool.query(
      `SELECT id, card_number, cardholder_name, expiry_month, expiry_year, created_at
       FROM payment_cards
       WHERE username = $1
       ORDER BY created_at DESC`,
      [username]
    );

    res.json(result.rows);
  } catch (err) {
    // If table doesn't exist, return empty array
    if (err.message.includes('does not exist')) {
      return res.json([]);
    }
    console.error("Get cards error:", err);
    res.status(500).json({ error: "Failed to fetch cards: " + err.message });
  }
});

// ADD a new card
app.post("/api/cards", async (req, res) => {
  try {
    const username = getUsername(req);
    if (!username) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { card_number, cardholder_name, expiry_month, expiry_year, cvv } = req.body;

    if (!card_number || !cardholder_name || !expiry_month || !expiry_year) {
      return res.status(400).json({ error: "Missing required card information" });
    }

    // Validate card number (remove spaces and check length)
    const cleanedCardNumber = card_number.replace(/\s/g, '');
    if (cleanedCardNumber.length < 13 || cleanedCardNumber.length > 19) {
      return res.status(400).json({ error: "Invalid card number length" });
    }

    // Validate expiry month
    if (expiry_month < 1 || expiry_month > 12) {
      return res.status(400).json({ error: "Invalid expiry month" });
    }

    // Validate expiry year
    const currentYear = new Date().getFullYear();
    if (expiry_year < currentYear || expiry_year > currentYear + 50) {
      return res.status(400).json({ error: "Invalid expiry year" });
    }

    // Note: CVV is stored in the database but we don't return it for security
    const result = await pool.query(
      `INSERT INTO payment_cards (username, card_number, cardholder_name, expiry_month, expiry_year, cvv)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, card_number, cardholder_name, expiry_month, expiry_year, created_at`,
      [username, cleanedCardNumber, cardholder_name.trim(), parseInt(expiry_month), parseInt(expiry_year), cvv || '']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Add card error:", err);
    // Provide more specific error messages
    if (err.code === '23505') { // Unique constraint violation
      return res.status(400).json({ error: "This card is already registered" });
    }
    if (err.code === '23502') { // Not null violation
      return res.status(400).json({ error: "Missing required fields" });
    }
    res.status(500).json({ error: "Failed to add card: " + err.message });
  }
});

// DELETE a card
app.delete("/api/cards/:id", async (req, res) => {
  try {
    const username = getUsername(req);
    if (!username) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await pool.query(
      `DELETE FROM payment_cards
       WHERE id = $1 AND username = $2
       RETURNING id`,
      [req.params.id, username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Card not found" });
    }

    res.json({ message: "Card deleted" });
  } catch (err) {
    console.error("Delete card error:", err);
    res.status(500).json({ error: "Failed to delete card: " + err.message });
  }
});

// ========== CHECKOUT ROUTE ==========

app.post("/api/checkout", async (req, res) => {
  try {
    const username = getUsername(req);
    if (!username) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { card_id, items, subtotal, tax, shipping, total } = req.body;

    if (!card_id || !items || items.length === 0) {
      return res.status(400).json({ error: "Missing required checkout information" });
    }

    // Verify card belongs to user
    const cardCheck = await pool.query(
      `SELECT id FROM payment_cards WHERE id = $1 AND username = $2`,
      [card_id, username]
    );

    if (cardCheck.rows.length === 0) {
      return res.status(403).json({ error: "Card not found or access denied" });
    }

    // Create order (using username, not user_email)
    const orderResult = await pool.query(
      `INSERT INTO orders (username, card_id, subtotal, tax, shipping, total)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [username, card_id, subtotal, tax, shipping, total]
    );

    const orderId = orderResult.rows[0].id;

    // Add order items
    for (const item of items) {
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    // Clear user's cart after successful checkout
    await pool.query("DELETE FROM cart_items WHERE username = $1", [username]);

    res.json({ 
      success: true,
      order_id: orderId,
      message: "Order placed successfully"
    });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Failed to process checkout" });
  }
});

// ========== AI CHATBOT ROUTE ==========

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

// ========== START SERVER ==========
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`✅ Server running on port ${PORT}`));