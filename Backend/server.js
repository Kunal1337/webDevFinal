// Replace your cart routes in server.js with these fixed versions:

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

// Fix CHECKOUT to use username consistently
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