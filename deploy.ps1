# Medical Clinic Demo - Deployment Script
# Run this from PowerShell

Write-Host "🚀 Medical Clinic Demo - Deployment Preparation" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (!(Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this from the demo-prototype folder" -ForegroundColor Red
    exit 1
}

# Step 1: Install dependencies
Write-Host "📦 Step 1: Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Step 2: Build the project
Write-Host ""
Write-Host "🔨 Step 2: Building production bundle..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Build successful! Files are in the 'dist' folder" -ForegroundColor Green
Write-Host ""

# Step 3: Test the build locally
Write-Host "🧪 Step 3: Testing production build..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Starting preview server..." -ForegroundColor Cyan
Write-Host "Open your browser to: http://localhost:4173" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server when done testing." -ForegroundColor Yellow
Write-Host ""

npm run preview
