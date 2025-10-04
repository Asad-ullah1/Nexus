@echo off
echo Nexus Backend - Fix Missing Database Columns
echo =============================================
echo.
echo This script will add missing columns to your PostgreSQL database
echo to match your TypeORM entities.
echo.

set /p DB_USER="Enter PostgreSQL username (default: postgres): "
if "%DB_USER%"=="" set DB_USER=postgres

set /p DB_PASSWORD="Enter PostgreSQL password: "

echo.
echo Adding missing columns...
echo.

psql -U %DB_USER% -d nexusdb -c "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';"
psql -U %DB_USER% -d nexusdb -c "UPDATE \"user\" SET role = 'user' WHERE role IS NULL;"
psql -U %DB_USER% -d nexusdb -c "ALTER TABLE \"user\" ALTER COLUMN role SET NOT NULL;"
psql -U %DB_USER% -d nexusdb -c "ALTER TABLE \"insight\" ADD COLUMN IF NOT EXISTS category VARCHAR(255);"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Database columns fixed successfully!
    echo Your database now matches your TypeORM entities.
    echo.
    echo You can now start your backend:
    echo npm run start:dev
) else (
    echo.
    echo ❌ Failed to fix database columns.
    echo Please check:
    echo - PostgreSQL is running
    echo - nexusdb database exists
    echo - Username and password are correct
)

echo.
pause
