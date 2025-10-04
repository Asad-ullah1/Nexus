-- Nexus Backend Database Setup Script
-- Run this script to properly set up your PostgreSQL database

-- Step 1: Create database if it doesn't exist (run this as superuser)
-- CREATE DATABASE nexusdb;

-- Step 2: Connect to nexusdb and run the following commands

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS "insight" CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

-- Create user table
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create insight table with proper constraints
CREATE TABLE "insight" (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    summary TEXT,
    category VARCHAR(255),
    tags TEXT[],
    "sourceUrl" VARCHAR(255),
    "userId" INTEGER NOT NULL, -- Explicitly NOT NULL
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Foreign key constraint
    CONSTRAINT fk_insight_user 
        FOREIGN KEY ("userId") 
        REFERENCES "user"(id) 
        ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_insight_user_id ON "insight"("userId");
CREATE INDEX idx_insight_created_at ON "insight"(created_at);
CREATE INDEX idx_user_email ON "user"(email);

-- Insert default test user
INSERT INTO "user" (name, email, password, role)
VALUES ('Test User', 'test@nexus.com', '$2b$10$example_hash_for_testing', 'user');

-- Insert sample insight
INSERT INTO "insight" (title, content, summary, "userId")
VALUES (
    'Welcome to Nexus', 
    'This is your first insight in the Nexus platform. You can create, edit, and manage your insights here.',
    'Welcome message for new users',
    1
);

-- Verify the setup
SELECT 'Database setup completed successfully!' as status;
SELECT 'Users:' as info, COUNT(*) as count FROM "user";
SELECT 'Insights:' as info, COUNT(*) as count FROM "insight";

-- Show sample data
SELECT 'Sample data:' as info;
SELECT u.id, u.name, u.email, COUNT(i.id) as insight_count
FROM "user" u
LEFT JOIN "insight" i ON u.id = i."userId"
GROUP BY u.id, u.name, u.email;
