-- =============================================================================
-- AuraResto OS — Supabase PostgreSQL Schema (Platinum Tier)
-- =============================================================================

CREATE TYPE user_role AS ENUM ('customer', 'staff', 'kitchen', 'admin');
CREATE TYPE table_status AS ENUM ('free', 'occupied', 'reserved');
CREATE TYPE order_status AS ENUM ('placed', 'in_kitchen', 'ready', 'served', 'billed');

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    role user_role DEFAULT 'customer',
    name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Restaurants Table
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    opens_at TIME DEFAULT '11:00',
    closes_at TIME DEFAULT '23:00'
);

-- 3. Tables Management
CREATE TABLE tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id),
    table_number TEXT NOT NULL,
    capacity INT NOT NULL DEFAULT 4,
    status table_status DEFAULT 'free'
);

-- 4. Ingredients Inventory
CREATE TABLE ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    unit TEXT NOT NULL, -- e.g. 'g', 'ml', 'pcs'
    current_stock NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    reorder_threshold NUMERIC(10, 2) NOT NULL DEFAULT 10.0
);

-- 5. Menu Items
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    prep_time_mins INT DEFAULT 15,
    is_available_manual_override BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Dish Recipe Ingredient Mapping (Auto-Availability Engine Link)
CREATE TABLE menu_item_ingredients (
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
    quantity_required NUMERIC(10, 2) NOT NULL,
    PRIMARY KEY (menu_item_id, ingredient_id)
);

-- 7. Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_id UUID REFERENCES tables(id),
    customer_id UUID REFERENCES users(id),
    status order_status DEFAULT 'placed',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    eta_estimate INT DEFAULT 15,
    sla_breach_at TIMESTAMPTZ
);

-- 8. Order Items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id),
    quantity INT NOT NULL DEFAULT 1,
    status TEXT DEFAULT 'queued',
    prep_time_actual INT
);

-- 9. Reservations
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES users(id),
    table_id UUID REFERENCES tables(id),
    reserved_for TIMESTAMPTZ NOT NULL,
    party_size INT DEFAULT 2,
    status TEXT DEFAULT 'confirmed'
);

-- 10. Feedback
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Auto-Availability Trigger: Decrements Stock & Publishes Realtime Event
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION decrement_inventory_on_order()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE ingredients i
    SET current_stock = GREATEST(0, i.current_stock - (mii.quantity_required * NEW.quantity))
    FROM menu_item_ingredients mii
    WHERE mii.menu_item_id = NEW.menu_item_id
      AND mii.ingredient_id = i.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_decrement_inventory
AFTER INSERT ON order_items
FOR EACH ROW EXECUTE FUNCTION decrement_inventory_on_order();

-- Supabase Realtime enable
ALTER PUBLICATION supabase_realtime ADD TABLE ingredients, menu_items, orders, tables;
