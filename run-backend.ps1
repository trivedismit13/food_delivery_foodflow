# FoodFlow Backend - Local Runner
# Double-click or run: powershell -ExecutionPolicy Bypass -File run-backend.ps1

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   FoodFlow Backend - Local Dev Mode    " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Profile  : local" -ForegroundColor Green
Write-Host "Port     : 8080" -ForegroundColor Green
Write-Host "Database : localhost:3306/food_flow" -ForegroundColor Green
Write-Host "Health   : http://localhost:8080/actuator/health" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Yellow
Write-Host ""

Set-Location "$PSScriptRoot\backend"
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=local"
