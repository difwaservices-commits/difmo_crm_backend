# PowerShell script to test payroll email for ramjeekumaryadav558@gmail.com
# Usage: .\test-payroll-email.ps1 -Token "your-auth-token"

param(
    [string]$Token = "",
    [string]$Email = "ramjeekumaryadav558@gmail.com"
)

# Color functions
function Write-Success { Write-Host "✅ $args" -ForegroundColor Green }
function Write-Error-Custom { Write-Host "❌ $args" -ForegroundColor Red }
function Write-Warning-Custom { Write-Host "⚠️  $args" -ForegroundColor Yellow }
function Write-Info { Write-Host "ℹ️  $args" -ForegroundColor Blue }
function Write-Header { 
    Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host $args -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
}

# Main
Write-Header "PAYROLL EMAIL TEST - $Email"

$BaseUrl = "http://localhost:3000"

# Check token
if ([string]::IsNullOrWhiteSpace($Token)) {
    Write-Warning-Custom "No auth token provided"
    Write-Info "Usage: .\test-payroll-email.ps1 -Token `"your-token`""
    Write-Info ""
    Write-Info "To get a token:"
    Write-Info "1. Open browser DevTools (F12) on the application"
    Write-Info "2. Go to Application > LocalStorage"
    Write-Info "3. Find 'token' key and copy its value"
    Write-Info "4. Run: .\test-payroll-email.ps1 -Token `"copied-token`""
    exit 1
}

Write-Success "Using provided AUTH token`n"

# Create headers
$Headers = @{
    "Authorization" = "Bearer $Token"
    "Content-Type" = "application/json"
}

# Step 1: Get employees
Write-Host "→ Step 1: Fetching employees..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/employees" -Headers $Headers -Method Get
    $employees = if ($response.data) { $response.data } else { $response }
    Write-Success "Fetched $($employees.Count) employees"
} catch {
    Write-Error-Custom "Failed to fetch employees: $($_.Exception.Message)"
    exit 1
}

# Step 2: Find target employee
$employee = $employees | Where-Object { $_.user.email -eq $Email -or $_.email -eq $Email } | Select-Object -First 1

if ($null -eq $employee) {
    Write-Error-Custom "Employee with email '$Email' not found"
    Write-Info "Available employees:"
    $employees | Select-Object -First 5 | ForEach-Object {
        Write-Info "  - $($_.user.firstName) $($_.user.lastName) ($($_.user.email))"
    }
    exit 1
}

Write-Success "Found employee:"
Write-Host "  Name: $($employee.user.firstName) $($employee.user.lastName)"
Write-Host "  Email: $($employee.user.email)"
Write-Host "  Salary: $($employee.salary)"
Write-Host "  Designation: $($employee.designation)"
Write-Host "  ID: $($employee.id)`n"

# Step 3: Get attendance
Write-Host "→ Step 2: Fetching attendance records..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/attendance?employeeId=$($employee.id)" -Headers $Headers -Method Get
    $attendances = if ($response.data) { $response.data } else { $response }
    Write-Success "Found $($attendances.Count) attendance records"
} catch {
    Write-Error-Custom "Failed to fetch attendance: $($_.Exception.Message)"
    Write-Warning-Custom "Skipping payroll generation - no attendance data available"
    exit 1
}

$attendance = $attendances | Select-Object -First 1

if ($null -eq $attendance) {
    Write-Error-Custom "No attendance records found"
    exit 1
}

Write-Success "Using latest attendance:"
Write-Host "  Date: $($attendance.date)"
Write-Host "  Status: $($attendance.status)"
Write-Host "  ID: $($attendance.id)`n"

# Step 4: Generate Payroll
Write-Host "→ Step 3: Generating payroll (this will send email)..." -ForegroundColor Cyan

$month = (Get-Date).Month
$year = (Get-Date).Year

$payload = @{
    attendanceId = $attendance.id
    month = $month
    year = $year
} | ConvertTo-Json

Write-Info "Endpoint: POST /finance/generate"
Write-Info "Month: $month, Year: $year"
Write-Info "Attendance ID: $($attendance.id)`n"

try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/finance/generate" `
        -Headers $Headers `
        -Method Post `
        -Body $payload

    Write-Success "Payroll generated successfully!"
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Yellow
    $response | ConvertTo-Json | Write-Host
} catch {
    Write-Error-Custom "Failed to generate payroll: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Error-Custom "Status: $($_.Exception.Response.StatusCode)"
    }
    exit 1
}

# Step 5: Verify emails
Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "→ Step 4: Email Verification" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

Write-Info ""
Write-Warning-Custom "Check the backend console (npm start terminal) for these messages:"
Write-Host ""
Write-Host "Expected Success Messages:" -ForegroundColor Green
Write-Host "  ✅ [FinanceService] Notification sent to employee" 
Write-Host "  ✅ [FinanceService] Email sent to employee (ramjeekumaryadav558@gmail.com)" 
Write-Host ""
Write-Host "If you see error messages:" -ForegroundColor Red
Write-Host "  ❌ [FinanceService] Failed to notify employee"
Write-Host "  ❌ [FinanceService] Failed to send payroll email"
Write-Host ""

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "✅ TEST COMPLETE" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""
