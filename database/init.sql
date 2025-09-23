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
('Electronics', 'Electronic devices and gadgets', 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400'),
('Clothing', 'Fashion and apparel', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'),
('Home & Garden', 'Home decoration and garden tools', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'),
('Sports', 'Sports equipment and accessories', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'),
('Books', 'Books and educational materials', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400');

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
    ('iPhone 15 Pro', 'Latest Apple smartphone with advanced features', 999.99, 'Electronics', ARRAY['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'], 50, true, 4.8, 125),
    ('MacBook Air M3', 'Lightweight laptop with powerful M3 chip', 1299.99, 'Electronics', ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'], 30, true, 4.9, 89),
    ('Nike Air Max', 'Comfortable running shoes', 129.99, 'Clothing', ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'], 100, false, 4.5, 234),
    ('Designer T-Shirt', 'Premium cotton t-shirt', 29.99, 'Clothing', ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'], 200, false, 4.3, 156),
    ('Smart Watch', 'Fitness tracking smartwatch', 299.99, 'Electronics', ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'], 75, true, 4.6, 98),
    ('Wireless Headphones', 'Noise-canceling wireless headphones', 199.99, 'Electronics', ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'], 60, false, 4.4, 167),
    ('Garden Tools Set', 'Complete set of garden tools', 79.99, 'Home & Garden', ARRAY['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'], 40, false, 4.2, 45),
    ('Basketball', 'Professional basketball', 49.99, 'Sports', ARRAY['https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400'], 80, false, 4.7, 78),
    ('Programming Book', 'Learn Python programming', 39.99, 'Books', ARRAY['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'], 120, false, 4.8, 203)
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
