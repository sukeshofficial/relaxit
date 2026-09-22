# Relaxit Backend Automated Deployment Script
$ErrorActionPreference = "Stop"

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " 🚀 Starting Automated Backend Build & Deploy" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# 1. Paths Setup
$rootDir = (Get-Item $PSScriptRoot).Parent.FullName
$backendDir = Join-Path $rootDir "backend"
$deploymentDir = Join-Path $rootDir "deployment"

# 2. Build backend JAR
Write-Host "`n[1/5] Building backend JAR (mvnw clean package -DskipTests)..." -ForegroundColor Yellow
Set-Location $backendDir
.\mvnw.cmd clean package -DskipTests

# 3. Locate generated JAR
$targetDir = Join-Path $backendDir "target"
$generatedJar = Get-ChildItem -Path $targetDir -Filter "*.jar" | Where-Object { $_.Name -notlike "*original*" } | Select-Object -First 1

if (-not $generatedJar) {
    Write-Error "No compiled JAR file found in $targetDir"
    exit 1
}

Write-Host "Compiled JAR found: $($generatedJar.Name)" -ForegroundColor Green

# 4. Remove old JARs in deployment folder and copy new JAR
Write-Host "`n[2/5] Updating deployment folder JAR..." -ForegroundColor Yellow
Get-ChildItem -Path $deploymentDir -Filter "*.jar" | Remove-Item -Force
Copy-Item -Path $generatedJar.FullName -Destination (Join-Path $deploymentDir $generatedJar.Name) -Force
Write-Host "Copied $($generatedJar.Name) to deployment folder." -ForegroundColor Green

# 5. Git Commit & Push Prompt
Write-Host "`n[3/5] Git Commit and Push..." -ForegroundColor Yellow
Set-Location $rootDir
git add .
$commitMsg = Read-Host "Enter Git commit message (leave blank to skip git push)"

if (-not [string]::IsNullOrWhiteSpace($commitMsg)) {
    git commit -m "$commitMsg"
    Write-Host "Pushing to origin..." -ForegroundColor Yellow
    git push origin main
} else {
    Write-Host "Skipped Git commit and push." -ForegroundColor Gray
}

# 6. Catalyst Appsail Deploy
Write-Host "`n[4/5] Deploying to Catalyst Appsail..." -ForegroundColor Yellow
Set-Location $deploymentDir

try {
    catalyst deploy --only appsail
    Write-Host "`n[5/5] 🎉 Deployment completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "`n⚠️ Catalyst deployment failed. Please ensure you are logged into Catalyst ('catalyst login')." -ForegroundColor Red
}
