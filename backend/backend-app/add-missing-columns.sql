-- Add missing columns to match TypeORM entities
-- This script ensures your PostgreSQL database matches your TypeORM entities

-- Step 1: Add role column to user table
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';

-- Step 2: Update existing users to have the default role
UPDATE "user" SET role = 'user' WHERE role IS NULL;

-- Step 3: Make role column NOT NULL
ALTER TABLE "user" ALTER COLUMN role SET NOT NULL;

-- Step 4: Add category column to insight table (if missing)
ALTER TABLE "insight" ADD COLUMN IF NOT EXISTS category VARCHAR(255);

-- Step 5: Verify the changes
SELECT 'User table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'user'
ORDER BY ordinal_position;

SELECT 'Insight table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'insight'
ORDER BY ordinal_position;

-- Step 6: Show sample data
SELECT 'Sample user data:' as info;
SELECT id, name, email, role, created_at
FROM "user"
LIMIT 5;

SELECT 'Sample insight data:' as info;
SELECT id, title, category, "userId", created_at
FROM "insight"
LIMIT 5;
