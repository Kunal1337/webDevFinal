# Database Setup Instructions

## 🚨 CRITICAL: Run This on Your Render PostgreSQL Database

The backend code expects specific database schema with `username` columns. If you're seeing 500 errors when adding to cart, the database schema needs to be updated.

## Quick Setup - Run Complete Schema

### Step 1: Access Your Render Database

1. Go to your Render Dashboard (https://dashboard.render.com/)
2. Navigate to your PostgreSQL database instance
3. Click on "Connect" and copy the **External Database URL** or use the **psql command**
4. Open the **Shell** tab in Render dashboard OR use a PostgreSQL client like pgAdmin

### Step 2: Run the Complete Schema

**Option A: Copy/Paste the SQL**

Copy the entire contents of `complete_schema.sql` or `database_setup.sql` and paste into the Render Shell.

**Option B: Run via psql CLI**

```bash
psql <YOUR_DATABASE_URL> < Backend/complete_schema.sql
```

### Step 3: Verify Schema

Run these verification queries in your database:

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verify cart_items has username column
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cart_items';
```

Expected output should show:
- Tables: `watches`, `cart_items`, `payment_cards`, `orders`, `order_items`
- cart_items columns should include: `id`, `username`, `product_id`, `quantity`, `created_at`

### Step 4: Restart Your Backend Service

1. Go back to your Render Dashboard
2. Navigate to your **Backend Web Service**
3. Click **Manual Deploy** > **Clear build cache & deploy**
4. Wait for deployment to complete

### Step 5: Test the Application

1. Log in to your application
2. Try adding an item to cart
3. Check browser console - should NOT see 500 errors
4. Try viewing cart, adding/removing items
5. Add a payment card
6. Complete checkout

---

## What This Schema Does

### Table Structure

1. **watches** - Product catalog with Cloudinary image URLs
2. **cart_items** - User-specific shopping carts (ephemeral)
3. **payment_cards** - Saved payment methods per user
4. **orders** - Completed order records
5. **order_items** - Line items for each order

### Key Changes from Previous Schema

- ✅ `cart_items` now has `username` column (was missing before)
- ✅ All tables use `username` instead of `user_email`
- ✅ Proper foreign key constraints and indexes
- ✅ UNIQUE constraint on (username, product_id) prevents duplicate cart items

### Data Impact

- ⚠️ Running this will **DROP the old cart_items table** (cart data is ephemeral)
- ✅ All other tables use `CREATE TABLE IF NOT EXISTS` (preserves existing data)
- ✅ Watches, payment cards, and orders are preserved

---

## Troubleshooting

### Still getting 500 errors?

Check the Render backend logs:

1. Go to Render Dashboard > Your Web Service
2. Click **Logs** tab
3. Look for error messages like:
   - "column 'username' does not exist" → Schema not updated yet
   - "relation 'cart_items' does not exist" → Table not created
   - Foreign key violations → Check that watches table has data

### Error Code Reference

The backend now logs detailed PostgreSQL error codes:

- `42703` - Undefined column (username column missing)
- `42P01` - Undefined table (cart_items table not created)
- `23503` - Foreign key violation (product_id doesn't exist in watches)

### Need to Reset Everything?

If you want a completely clean slate:

```sql
-- WARNING: This deletes ALL data
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS payment_cards CASCADE;
DROP TABLE IF EXISTS watches CASCADE;

-- Then run the complete_schema.sql
```



