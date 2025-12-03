// server.js
import express from "express";
import cors from "cors";
import pkg from "pg";
import "dotenv/config";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// ----- DATABASE CONNECTION -----
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, 
});

pool.connect()
  .then(() => console.log(" Connected to Render PostgreSQL"))
  .catch(err => console.error(" Database connection error:", err));

// ----- ROUTES -----

// Test route
app.get("/", (req, res) => {
  res.send("Watch API is running");
});

// CREATE a watch
app.post("/api/watches", async (req, res) => {
  try {
    const { brand, model, price, description } = req.body;

    const result = await pool.query(
      `INSERT INTO watches (brand, model, price, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [brand, model, price, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(" Create error:", err);
    res.status(500).json({ error: "Failed to create watch" });
  }
});

// READ all watches
app.get("/api/watches", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM watches ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(" Read error:", err);
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
    console.error(" Read single error:", err);
    res.status(500).json({ error: "Failed to fetch watch" });
  }
});

// UPDATE a watch
app.put("/api/watches/:id", async (req, res) => {
  try {
    const { brand, model, price, description } = req.body;

    const result = await pool.query(
      `UPDATE watches
       SET brand=$1, model=$2, price=$3, description=$4
       WHERE id=$5
       RETURNING *`,
      [brand, model, price, description, req.params.id]
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
    console.error(" Delete error:", err);
    res.status(500).json({ error: "Failed to delete watch" });
  }
});

// ------- SMART AI CHATBOX (READING DATABASE) -------
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // Fetch watches from your database
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
        { role: "user", content: aiPrompt }
      ]
    });

    res.json({ reply: completion.choices[0].message.content || "" });

  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({ error: "AI request failed" });
  }
});


// ----- START SERVER -----
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
