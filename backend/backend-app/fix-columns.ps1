# Fix missing columns in PostgreSQL database
# This script adds missing columns to match your TypeORM entities

Write-Host "Nexus Backend - Fix Missing Database Columns" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This script will add missing columns to your PostgreSQL database" -ForegroundColor Yellow
Write-Host "to match your TypeORM entities." -ForegroundColor Yellow
Write-Host ""

# Get database credentials
$DB_USER = Read-Host "Enter PostgreSQL username (default: postgres)"
if ([string]::IsNullOrEmpty($DB_USER)) { $DB_USER = "postgres" }

$DB_PASSWORD = Read-Host "Enter PostgreSQL password" -AsSecureString
$DB_PASSWORD_PLAIN = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($DB_PASSWORD))

Write-Host ""
Write-Host "Adding missing columns..." -ForegroundColor Green
Write-Host ""

try {
    # Set environment variable for password
    $env:PGPASSWORD = $DB_PASSWORD_PLAIN
    
    # Run the SQL commands directly
    $sqlCommands = @"
-- Add missing columns to match TypeORM entities
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';
UPDATE "user" SET role = 'user' WHERE role IS NULL;
ALTER TABLE "user" ALTER COLUMN role SET NOT NULL;
ALTER TABLE "insight" ADD COLUMN IF NOT EXISTS category VARCHAR(255);

-- Verify the changes
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
"@

    # Execute the SQL commands
    echo $sqlCommands | psql -U $DB_USER -d nexusdb
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Database columns fixed successfully!" -ForegroundColor Green
        Write-Host "Your database now matches your TypeORM entities." -ForegroundColor Green
        Write-Host ""
        Write-Host "You can now start your backend:" -ForegroundColor Yellow
        Write-Host "npm run start:dev" -ForegroundColor White
    } else {
        throw "psql command failed with exit code $LASTEXITCODE"
    }
} catch {
    Write-Host ""
    Write-Host "❌ Failed to fix database columns: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "- PostgreSQL is running" -ForegroundColor Yellow
    Write-Host "- nexusdb database exists" -ForegroundColor Yellow
    Write-Host "- Username and password are correct" -ForegroundColor Yellow
    Write-Host "- psql command is available in PATH" -ForegroundColor Yellow
} finally {
    # Clear password from environment
    Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
}

Write-Host ""
Read-Host "Press Enter to continue"
