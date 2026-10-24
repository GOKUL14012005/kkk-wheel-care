-- ====================================================================
-- KKK Wheel Care - Relational Database Schema & Initial Seed Data
-- Satisfies Requirement 6: Three-tier architecture with MySQL CRUD
-- ====================================================================

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS kkk_wheel_care
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE kkk_wheel_care;

-- 2. Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  vehicle_number VARCHAR(30) NOT NULL,
  vehicle_type VARCHAR(50) NOT NULL DEFAULT 'Sedan',
  password_hash VARCHAR(255) NOT NULL,
  city VARCHAR(80) DEFAULT 'Chennai',
  pincode VARCHAR(10) DEFAULT '600001',
  role ENUM('CUSTOMER', 'ADMIN') DEFAULT 'CUSTOMER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_customer_email (email),
  INDEX idx_customer_vehicle (vehicle_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Products & Services Inventory Table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sku VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(180) NOT NULL,
  category ENUM('tyres', 'batteries', 'services', 'solar', 'purifiers') NOT NULL,
  brand VARCHAR(80) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0,
  vehicle_type VARCHAR(50) DEFAULT 'all',
  terrain VARCHAR(50) DEFAULT 'all',
  specifications JSON NULL,
  image_url VARCHAR(255) NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_product_category (category),
  INDEX idx_product_brand (brand),
  INDEX idx_product_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_reference VARCHAR(40) NOT NULL UNIQUE,
  customer_id INT NULL,
  customer_name VARCHAR(120) NOT NULL,
  customer_email VARCHAR(160) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  vehicle_number VARCHAR(30) NOT NULL,
  service_name VARCHAR(180) NOT NULL,
  service_price DECIMAL(10, 2) NOT NULL,
  booking_date DATE NOT NULL,
  time_slot VARCHAR(40) NOT NULL,
  notes TEXT NULL,
  status ENUM('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'CONFIRMED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_booking_customer FOREIGN KEY (customer_id) 
    REFERENCES customers(id) ON DELETE SET NULL,
  INDEX idx_booking_ref (booking_reference),
  INDEX idx_booking_date (booking_date),
  INDEX idx_booking_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Booking Line Items Table
CREATE TABLE IF NOT EXISTS booking_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  product_id INT NULL,
  item_name VARCHAR(180) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_items_booking FOREIGN KEY (booking_id) 
    REFERENCES bookings(id) ON DELETE CASCADE,
  CONSTRAINT fk_items_product FOREIGN KEY (product_id) 
    REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ====================================================================
-- Initial Seed Data: High Quality Catalogue Products & Services
-- ====================================================================
INSERT INTO products (sku, name, category, brand, description, price, stock_quantity, vehicle_type, terrain, specifications, image_url)
VALUES
  ('TYR-BST-001', 'Bridgestone Turanza T005', 'tyres', 'Bridgestone', 'Ultra-silent highway comfort, outstanding wet braking, high durability silica compound.', 5800.00, 24, 'sedan', 'city', '{"size": "195/65 R15", "speedRating": "H", "loadIndex": 91}', 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80'),
  ('TYR-MCH-002', 'Michelin Primacy 4 ST', 'tyres', 'Michelin', 'Acoustic dampening ribbing, class-leading wet safety even when worn down.', 7400.00, 16, 'sedan', 'city', '{"size": "205/55 R16", "speedRating": "V", "loadIndex": 94}', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80'),
  ('TYR-APL-003', 'Apollo Apterra AT2 (SUV)', 'tyres', 'Apollo', 'Aggressive tread block, herringbone grooves for slush and off-road traction.', 6900.00, 20, 'suv', 'all-terrain', '{"size": "215/65 R16", "speedRating": "H", "loadIndex": 98}', 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=600&q=80'),
  ('BAT-AMR-004', 'Amaron PRO Hi-Life 45Ah', 'batteries', 'Amaron', 'Silven X alloy zero-maintenance automotive battery with high cranking amps and 60-month warranty.', 5200.00, 18, 'all', 'all', '{"capacity": "45Ah", "warrantyMonths": 60, "technology": "Silver-X Calcium"}', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80'),
  ('BAT-EXD-005', 'Exide Matrix MTRED55', 'batteries', 'Exide', 'Heavy-duty heat tolerance, puncture-resistant separator, rapid charge recovery and 55-month warranty.', 6100.00, 15, 'all', 'all', '{"capacity": "55Ah", "warrantyMonths": 55, "technology": "Absorbent Glass Mat Hybrid"}', 'https://images.unsplash.com/photo-1558441719-7d8eb99a0f44?auto=format&fit=crop&w=600&q=80'),
  ('SRV-ALN-006', 'Computerized 3D Wheel Alignment', 'services', 'KKK Workshop', 'Digital multi-axis sensor calibration, prevents uneven tyre wear and eliminates steering drift.', 650.00, 999, 'all', 'all', '{"durationMinutes": 30, "warrantyDays": 30}', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80'),
  ('SRV-BLN-007', 'High-Speed Dynamic Balancing & Weights', 'services', 'KKK Workshop', 'Removes high-speed vibrations, includes computerized zinc balance clip weights for 4 wheels.', 550.00, 999, 'all', 'all', '{"durationMinutes": 25, "wheelsCovered": 4}', 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80'),
  ('SOL-SWH-008', 'Solar Thermal Water Heater 200 LPD', 'solar', 'KKK Green', 'Evacuated Tube Collector (ETC), food-grade stainless steel inner tank with high-density PUF insulation.', 28500.00, 8, 'all', 'all', '{"capacityLpd": 200, "tubeCount": 20, "innerTank": "SS-304L"}', 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80'),
  ('PUR-ROU-009', '8-Stage RO Water Purifier System', 'purifiers', 'PureAqua', 'Copper enrichment, active carbon deodorizer, TDS regulator up to 2000 ppm with UV bactericide.', 14800.00, 12, 'all', 'all', '{"filtrationStages": 8, "purificationRateLph": 15, "storageLiters": 10}', 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80')
ON DUPLICATE KEY UPDATE
  price = VALUES(price),
  stock_quantity = VALUES(stock_quantity);

-- Seed Generic Sample Customer
INSERT INTO customers (id, full_name, email, phone, vehicle_number, vehicle_type, password_hash, city, pincode, role)
VALUES
  (1, 'Sample Customer', 'customer@kkkwheelcare.com', '9000000000', 'TN-00-AA-0000', 'Sedan', '*LOCKED_DEMO_ACCOUNT*', 'Chennai', '600001', 'CUSTOMER')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- Seed Generic Sample Booking
INSERT INTO bookings (id, booking_reference, customer_id, customer_name, customer_email, customer_phone, vehicle_number, service_name, service_price, booking_date, time_slot, notes, status)
VALUES
  (1, 'BK-KKK-882190', 1, 'Sample Customer', 'customer@kkkwheelcare.com', '9000000000', 'TN-00-AA-0000', 'Computerized 3D Wheel Alignment & Balancing', 1200.00, CURRENT_DATE + INTERVAL 1 DAY, '10:30 AM', 'Check steering pull on left side', 'CONFIRMED')
ON DUPLICATE KEY UPDATE status = VALUES(status);
