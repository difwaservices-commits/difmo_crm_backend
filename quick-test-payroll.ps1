# Quick Start - Payroll Email Test
# This script automates the testing workflow for ramjeekumaryadav558@gmail.com

Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   PAYROLL EMAIL TEST - QUICK START                     ║" -ForegroundColor Cyan
Write-Host "║   Email: ramjeekumaryadav558@gmail.com                ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Get current directory
$currentDir = Get-Location
Write-Host "Current Directory: $currentDir`n"

# Check if in backend directory
if (-not (Test-Path ".\src\modules\mail")) {
    Write-Host "❌ Not in correct directory. Please run from 'difmo_crm_backend'" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Correct directory detected`n"

# Step 1: Check Mail Configuration
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "STEP 1: Checking Mail Configuration..." -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Yellow

node diagnose-mail.js

$confirm = Read-Host "`n✅ Is mail configuration OK? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "`n⚠️  Please fix mail configuration before continuing" -ForegroundColor Yellow
    exit 1
}

# Step 2: Get Auth Token
Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "STEP 2: Getting Auth Token..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

Write-Host "Instructions:" -ForegroundColor Green
Write-Host "1. Go to http://localhost:3000 in your browser"
Write-Host "2. Login to CRM"
Write-Host "3. Open DevTools (F12)"
Write-Host "4. Go to Storage → LocalStorage"
Write-Host "5. Find 'token' and copy the value`n"

$token = Read-Host "Paste your auth token here"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host "`n❌ No token provided" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Token received: $($token.Substring(0, 20))...`n"

# Step 3: Run Test
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Magenta
Write-Host "STEP 3: Running Payroll Email Test..." -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Magenta

.\test-payroll-email.ps1 -Token $token

# Step 4: Summary
Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "✅ TEST COMPLETED" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Green

Write-Host "📋 NEXT STEPS:

1. Check Backend Console:
   ✅ Look for '[FinanceService] Email sent' message
   ❌ If you see error, check mail configuration

2. Check Inbox:
   📧 Email should arrive at: ramjeekumaryadav558@gmail.com
   ⏱️  May take a few seconds to arrive
   📁 Check spam folder if not in inbox

3. If Email Not Received:
   ❓ Check credentials in .env
   ❓ Verify Gmail allows SMTP connections
   ❓ Check 2FA and App Password are set up correctly
   ❓ Check firewall/antivirus not blocking SMTP

For detailed troubleshooting, see: PAYROLL_EMAIL_TESTING.md
`

Read-Host "Press Enter to exit"
