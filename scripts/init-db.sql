-- init-db.sql: create core tables
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(128),
  email VARCHAR(128) UNIQUE,
  password_hash VARCHAR(255),
  role VARCHAR(16) DEFAULT 'USER',
  city VARCHAR(64),
  occupation VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS income_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  date DATE,
  amount DECIMAL(10,2),
  source VARCHAR(128),
  notes TEXT
);

CREATE TABLE IF NOT EXISTS risk_scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  date DATE,
  score INT,
  category VARCHAR(16),
  details JSON
);