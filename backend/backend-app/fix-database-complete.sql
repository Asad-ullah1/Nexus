-- Complete Database Fix Script for Nexus Backend
-- This script resolves the userId null constraint issue

-- Step 1: Check current state
SELECT 'Current database state:' as status;
SELECT 
    COUNT(*) as total_users,
    (SELECT COUNT(*) FROM "insight") as total_insights,
    (SELECT COUNT(*) FROM "insight" WHERE "userId" IS NULL) as insights_with_null_user
FROM "user";

-- Step 2: Create a default user if none exists
INSERT INTO "user" (name, email, password, role)
VALUES ('Default User', 'default@nexus.com', '$2b$10$default_hash_for_testing', 'user')
ON CONFLICT (email) DO NOTHING;

-- Step 3: Get the default user ID (or first user ID)
DO $$
DECLARE
    default_user_id INTEGER;
BEGIN
    -- Get the first user ID
    SELECT id INTO default_user_id FROM "user" ORDER BY id LIMIT 1;
    
    -- Update all null userId values to point to the default user
    UPDATE "insight" 
    SET "userId" = default_user_id
    WHERE "userId" IS NULL;
    
    RAISE NOTICE 'Updated insights to use user ID: %', default_user_id;
END $$;

-- Step 4: Delete any insights that still have null userId (safety measure)
DELETE FROM "insight" WHERE "userId" IS NULL;

-- Step 5: Ensure userId column is properly constrained
-- First, make sure the column exists and is the right type
ALTER TABLE "insight" ALTER COLUMN "userId" TYPE INTEGER;

-- Step 6: Add NOT NULL constraint if it doesn't exist
DO $$
BEGIN
    -- Check if the constraint already exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE table_name = 'insight' 
        AND constraint_type = 'CHECK' 
        AND constraint_name LIKE '%userId%'
    ) THEN
        ALTER TABLE "insight" ALTER COLUMN "userId" SET NOT NULL;
        RAISE NOTICE 'Added NOT NULL constraint to userId column';
    ELSE
        RAISE NOTICE 'NOT NULL constraint already exists on userId column';
    END IF;
END $$;

-- Step 7: Ensure foreign key constraint exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_insight_user'
          AND table_name = 'insight'
    ) THEN
        ALTER TABLE "insight"
        ADD CONSTRAINT fk_insight_user
        FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE;
        RAISE NOTICE 'Added foreign key constraint fk_insight_user';
    ELSE
        RAISE NOTICE 'Foreign key constraint fk_insight_user already exists';
    END IF;
END $$;

-- Step 8: Verify the fix
SELECT 'After fix verification:' as status;
SELECT 
    COUNT(*) as total_users,
    (SELECT COUNT(*) FROM "insight") as total_insights,
    (SELECT COUNT(*) FROM "insight" WHERE "userId" IS NULL) as insights_with_null_user,
    (SELECT COUNT(*) FROM "insight" i JOIN "user" u ON i."userId" = u.id) as valid_insights
FROM "user";

-- Step 9: Show sample data
SELECT 'Sample data:' as status;
SELECT u.id as user_id, u.email, COUNT(i.id) as insight_count
FROM "user" u
LEFT JOIN "insight" i ON u.id = i."userId"
GROUP BY u.id, u.email
ORDER BY u.id;

-- Step 10: Final verification - check for any remaining issues
SELECT 'Final verification:' as status;
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN 'SUCCESS: No null userId values found'
        ELSE 'WARNING: ' || COUNT(*) || ' null userId values still exist'
    END as result
FROM "insight" 
WHERE "userId" IS NULL;
