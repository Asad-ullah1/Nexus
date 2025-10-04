# Nexus Backend Database Fix Script (PowerShell)
# This script will fix your PostgreSQL database issues

Write-Host "Nexus Backend Database Fix Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This script will fix your PostgreSQL database issues." -ForegroundColor Yellow
Write-Host "Make sure PostgreSQL is running and you have access to the nexusdb database." -ForegroundColor Yellow
Write-Host ""

# Get database credentials
$DB_USER = Read-Host "Enter PostgreSQL username (default: postgres)"
if ([string]::IsNullOrEmpty($DB_USER)) { $DB_USER = "postgres" }

$DB_PASSWORD = Read-Host "Enter PostgreSQL password" -AsSecureString
$DB_PASSWORD_PLAIN = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($DB_PASSWORD))

Write-Host ""
Write-Host "Running database fix script..." -ForegroundColor Green
Write-Host ""

try {
    # Set environment variable for password
    $env:PGPASSWORD = $DB_PASSWORD_PLAIN
    
    # Run the fix script
    & psql -U $DB_USER -d nexusdb -f fix-database-complete.sql
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Database fix completed successfully!" -ForegroundColor Green
        Write-Host "You can now start your NestJS backend." -ForegroundColor Green
    } else {
        throw "psql command failed with exit code $LASTEXITCODE"
    }
} catch {
    Write-Host ""
    Write-Host "❌ Database fix failed: $($_.Exception.Message)" -ForegroundColor Red
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
