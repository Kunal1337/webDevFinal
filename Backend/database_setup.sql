-- ============================================
-- COMPLETE DATABASE SCHEMA FOR WATCH STORE
-- ============================================

-- 1. WATCHES TABLE (Must exist first - other tables reference it)
-- ============================================
CREATE TABLE IF NOT EXISTS watches (
  id SERIAL PRIMARY KEY,
  brand VARCHAR(255) NOT NULL,
  model VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add image_url column if table already exists without it
ALTER TABLE watches ADD COLUMN IF NOT EXISTS image_url TEXT;


-- 2. CART ITEMS (USER-SPECIFIC CARTS) - REQUIRES username COLUMN
-- ============================================
-- IMPORTANT: Drop and recreate to add username column
DROP TABLE IF EXISTS cart_items CASCADE;

CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  product_id INTEGER NOT NULL REFERENCES watches(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(username, product_id)
);

CREATE INDEX idx_cart_items_username ON cart_items(username);
CREATE INDEX idx_cart_items_product ON cart_items(product_id);


-- 3. PAYMENT CARDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payment_cards (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  card_number VARCHAR(19) NOT NULL,
  cardholder_name VARCHAR(255) NOT NULL,
  expiry_month INTEGER NOT NULL,
  expiry_year INTEGER NOT NULL,
  cvv VARCHAR(4) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payment_cards_username
ON payment_cards(username);


-- 4. ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  card_id INTEGER NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_username
ON orders(username);


-- 5. ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES watches(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order
ON order_items(order_id);


