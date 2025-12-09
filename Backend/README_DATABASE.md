# Database Setup - Quick Reference

## 🚨 If You're Seeing 500 Errors on Add to Cart

The database schema on Render needs to be updated. The `cart_items` table is missing the `username` column.

## Quick Fix (5 minutes)

### 1. Access Render Database Shell

Go to: https://dashboard.render.com/ → Your PostgreSQL Database → **Shell** tab

### 2. Copy and Run This SQL

Copy the entire contents of `Backend/complete_schema.sql` or `Backend/database_setup.sql` and paste into the Shell.

**OR** if you prefer, run this minimal migration:

```sql
-- This drops cart_items (cart data is temporary anyway) and recreates with username
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
```

### 3. Restart Backend on Render

Render Dashboard → Your Backend Web Service → Manual Deploy → **Deploy**

### 4. Test

- Log in to your app
- Try adding an item to cart
- Should work without 500 error!

---

## Files in This Directory

- **complete_schema.sql** - Full database schema (all 5 tables)
- **database_setup.sql** - Same as complete_schema.sql
- **DATABASE_SETUP_INSTRUCTIONS.md** - Detailed step-by-step guide with troubleshooting

## Schema Overview

Your app uses 5 tables:

1. **watches** - Product catalog
2. **cart_items** - Shopping carts (requires `username` column!)
3. **payment_cards** - Saved payment methods
4. **orders** - Order history
5. **order_items** - Order line items

## What Changed?

The backend code was updated to support **user-specific carts** using the `username` field from your Asgardeo authentication. The database needs to match this new schema.

### Before (didn't work):
```sql
-- Old cart_items table (missing username)
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  product_id INTEGER,
  quantity INTEGER
);
```

### After (works with auth):
```sql
-- New cart_items table (has username)
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,  -- Added!
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  UNIQUE(username, product_id)      -- Added!
);
```

## Troubleshooting

### Backend Logs Show "column 'username' does not exist"
→ Run the migration SQL above

### Backend Logs Show "relation 'cart_items' does not exist"
→ Run the complete_schema.sql

### Still Getting 500 Errors?
→ Check DATABASE_SETUP_INSTRUCTIONS.md for detailed troubleshooting
