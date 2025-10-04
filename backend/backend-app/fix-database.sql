-- Fix database schema issues
-- Run this script to clean up existing data and fix column constraints

-- Step 1: Update any null userId values to point to the first user
UPDATE "insight" 
SET "userId" = (SELECT id FROM "user" LIMIT 1)
WHERE "userId" IS NULL;

-- Step 2: Delete any insights that still have null userId (if no users exist)
DELETE FROM "insight" WHERE "userId" IS NULL;

-- Step 3: Make userId column non-nullable
ALTER TABLE "insight" ALTER COLUMN "userId" SET NOT NULL;

-- Step 4: Ensure we have at least one user
INSERT INTO "user" (name, email, password)
VALUES ('Test User', 'test@example.com', '$2b$10$example_hash')
ON CONFLICT (email) DO NOTHING;

-- Step 5: Verify the fix
SELECT 
    COUNT(*) as total_insights,
    COUNT("userId") as insights_with_user,
    COUNT(*) - COUNT("userId") as insights_with_null_user
FROM "insight";
