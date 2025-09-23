-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(255),
    avatar_url TEXT,
    is_google_user BOOLEAN DEFAULT FALSE,
    google_id VARCHAR(255) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    image_urls TEXT[] DEFAULT '{}',
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    shipping_address JSONB,
    billing_address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create chat_messages table for AI chat
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_from_ai BOOLEAN DEFAULT FALSE,
    session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);

-- Insert sample categories
INSERT INTO categories (name, description, image_url) VALUES
('Engine Parts', 'Engine components and accessories for tractors and off-road vehicles', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400'),
('Hydraulic Systems', 'Hydraulic pumps, cylinders, and system components', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400'),
('Transmission', 'Transmission parts and drivetrain components', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400'),
('Tires & Wheels', 'Tractor tires, rims, and wheel components', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400'),
('Attachments', 'Tractor attachments and implements', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400');

-- Insert sample products
INSERT INTO products (name, description, price, category_id, image_urls, stock_quantity, is_featured, rating, review_count) 
SELECT 
    p.name,
    p.description,
    p.price,
    c.id,
    p.image_urls,
    p.stock_quantity,
    p.is_featured,
    p.rating,
    p.review_count
FROM (VALUES
    ('Tractor Hydraulic Pump', 'High-pressure hydraulic pump for tractors and construction equipment', 1299.99, 'Hydraulic Systems', ARRAY['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400'], 15, true, 4.8, 25),
    ('Heavy Duty Tractor Tires', 'Premium agricultural tires for all terrain conditions', 899.99, 'Tires & Wheels', ARRAY['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400'], 8, true, 4.9, 18),
    ('Tractor Engine Filter Set', 'Complete engine filter kit for diesel tractors', 149.99, 'Engine Parts', ARRAY['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400'], 25, false, 4.5, 42),
    ('Hydraulic Cylinder', 'Heavy-duty hydraulic cylinder for loader attachments', 799.99, 'Hydraulic Systems', ARRAY['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400'], 12, true, 4.6, 31),
    ('Tractor Transmission Kit', 'Complete transmission rebuild kit', 2499.99, 'Transmission', ARRAY['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400'], 5, true, 4.7, 12),
    ('Tractor Seat', 'Comfortable suspension seat for long hours', 299.99, 'Engine Parts', ARRAY['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400'], 20, false, 4.4, 28),
    ('Tractor Blade Attachment', 'Heavy-duty blade for grading and leveling', 1299.99, 'Attachments', ARRAY['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400'], 6, false, 4.2, 15),
    ('Tractor Radiator', 'High-capacity radiator for cooling systems', 399.99, 'Engine Parts', ARRAY['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400'], 18, false, 4.6, 22),
    ('Tractor PTO Shaft', 'Power take-off shaft for implements', 199.99, 'Transmission', ARRAY['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400'], 30, false, 4.8, 35)
) AS p(name, description, price, category_name, image_urls, stock_quantity, is_featured, rating, review_count)
JOIN categories c ON c.name = p.category_name;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
