# Stop script execution on any error
$ErrorActionPreference = "Stop"

Write-Host "Waiting for services to stabilize..." -ForegroundColor Cyan
Start-Sleep -Seconds 2

Write-Host "------------------------------------------------"
Write-Host "Testing ML service (Port 8000)..." -ForegroundColor Cyan

try {
    # Invoke-RestMethod automatically parses JSON response into an object
    $mlResponse = Invoke-RestMethod -Uri "http://127.0.0.1:8000/predict?sample=1" -Method Get
    
    # Convert back to JSON text just for pretty printing to console
    $mlResponse | ConvertTo-Json -Depth 5
}
catch {
    Write-Error "Failed to reach ML Service on port 8000"
    Write-Error $_.Exception.Message
    exit 1
}

Write-Host "------------------------------------------------"
Write-Host "Testing Main API (Port 5000)..." -ForegroundColor Cyan

try {
    $apiResponse = Invoke-RestMethod -Uri "http://127.0.0.1:5000/api/predict?sample=1" -Method Get
    $apiResponse | ConvertTo-Json -Depth 5
}
catch {
    Write-Error "Failed to reach Main API on port 5000"
    Write-Error $_.Exception.Message
    exit 1
}

Write-Host "------------------------------------------------"
Write-Host "✅ Smoke tests passed successfully." -ForegroundColor Green