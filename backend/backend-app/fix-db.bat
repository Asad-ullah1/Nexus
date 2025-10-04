@echo off
echo Nexus Backend Database Fix Script
echo ================================

echo.
echo This script will fix your PostgreSQL database issues.
echo Make sure PostgreSQL is running and you have access to the nexusdb database.
echo.

set /p DB_USER="Enter PostgreSQL username (default: postgres): "
if "%DB_USER%"=="" set DB_USER=postgres

set /p DB_PASSWORD="Enter PostgreSQL password: "

echo.
echo Running database fix script...
echo.

psql -U %DB_USER% -d nexusdb -f fix-database-complete.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Database fix completed successfully!
    echo You can now start your NestJS backend.
) else (
    echo.
    echo ❌ Database fix failed. Please check the error messages above.
    echo Make sure:
    echo - PostgreSQL is running
    echo - nexusdb database exists
    echo - Username and password are correct
)

echo.
pause
