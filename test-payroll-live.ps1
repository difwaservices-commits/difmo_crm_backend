# 🧪 Live Payroll Email Test for ramjeekumaryadav558@gmail.com
# This script manually generates payroll and triggers email sending

$API_URL = "http://localhost:3000"
$TARGET_EMAIL = "ramjeekumaryadav558@gmail.com"

# Color output
function Write-Header {
    param([string]$Text)
    Write-Host "`n" + ("=" * 70) -ForegroundColor Cyan
    Write-Host "  $Text" -ForegroundColor Cyan
    Write-Host ("=" * 70) -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Text)
    Write-Host "  ✅ $Text" -ForegroundColor Green
}

function Write-Error {
    param([string]$Text)
    Write-Host "  ❌ $Text" -ForegroundColor Red
}

function Write-Info {
    param([string]$Text)
    Write-Host "  ℹ️  $Text" -ForegroundColor Yellow
}

Write-Host "`n🚀 PAYROLL EMAIL TEST - ramjeekumaryadav558@gmail.com`n" -ForegroundColor Magenta

# Step 1: Get Login Credentials
Write-Header "Step 1: Login to Get Auth Token"
Write-Info "Enter admin email and password to login"

$adminEmail = Read-Host "Enter admin email"
$adminPassword = Read-Host "Enter admin password" -AsSecureString
$adminPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicode($adminPassword))

try {
    $loginResponse = Invoke-RestMethod -Uri "$API_URL/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body (ConvertTo-Json @{
            email = $adminEmail
            password = $adminPasswordPlain
        })
    
    $TOKEN = $loginResponse.access_token
    Write-Success "Login successful!"
    Write-Info "Token obtained: $($TOKEN.Substring(0, 20))..."
} catch {
    Write-Error "Login failed: $($_.Exception.Message)"
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $TOKEN"
    "Content-Type"  = "application/json"
}

# Step 2: Get all employees
Write-Header "Step 2: Fetching All Employees"

try {
    $employeesResponse = Invoke-RestMethod -Uri "$API_URL/employees" `
        -Method GET `
        -Headers $headers
    
    Write-Success "Fetched $($employeesResponse.Count) employees"
} catch {
    Write-Error "Failed to fetch employees: $($_.Exception.Message)"
    exit 1
}

# Step 3: Find employee by target email
Write-Header "Step 3: Finding Employee with Email: $TARGET_EMAIL"

$targetEmployee = $employeesResponse | Where-Object { $_.user.email -eq $TARGET_EMAIL }

if (-not $targetEmployee) {
    Write-Error "Employee not found with email: $TARGET_EMAIL"
    Write-Info "Available employees with emails:"
    $employeesResponse | ForEach-Object {
        Write-Host "    - $($_.user.firstName) $($_.user.lastName): $($_.user.email)" -ForegroundColor Gray
    }
    exit 1
}

$empId = $targetEmployee.id
$empName = "$($targetEmployee.user.firstName) $($targetEmployee.user.lastName)"
$empEmail = $targetEmployee.user.email
$companyId = $targetEmployee.companyId

Write-Success "Found employee: $empName"
Write-Info "Employee ID: $empId"
Write-Info "Email: $empEmail"
Write-Info "Company ID: $companyId"

# Step 4: Get recent attendance
Write-Header "Step 4: Checking Attendance Records"

try {
    $attendanceResponse = Invoke-RestMethod -Uri "$API_URL/attendance?employeeId=$empId" `
        -Method GET `
        -Headers $headers
    
    if ($attendanceResponse.Count -eq 0) {
        Write-Error "No attendance records found for this employee"
        exit 1
    }
    
    $latestAttendance = $attendanceResponse | Sort-Object -Property date -Descending | Select-Object -First 1
    Write-Success "Found $($attendanceResponse.Count) attendance records"
    Write-Info "Latest attendance date: $($latestAttendance.date)"
} catch {
    Write-Error "Failed to fetch attendance: $($_.Exception.Message)"
    exit 1
}

# Step 5: Generate Payroll (MAIN TEST - This should send email)
Write-Header "Step 5: 🎯 GENERATING PAYROLL (Email Trigger)"

$now = Get-Date
$month = $now.Month
$year = $now.Year

Write-Info "Generating payroll for: $month/$year"
Write-Info "This will trigger email to: $empEmail"
Write-Info "From: ramjeekumaryadav733@gmail.com (MAIL_USER in .env)"

$payloadJson = ConvertTo-Json @{
    employeeId = $empId
    month      = $month
    year       = $year
    baseSalary = $targetEmployee.salary ?? 50000
    companyId  = $companyId
}

Write-Info "📤 Sending request..."

try {
    $payrollResponse = Invoke-RestMethod -Uri "$API_URL/finance/generate-single" `
        -Method POST `
        -Headers $headers `
        -Body $payloadJson
    
    Write-Host "`n" -ForegroundColor Cyan
    Write-Success "Payroll Generated Successfully!"
    Write-Host "`n📊 RESPONSE DETAILS:" -ForegroundColor Cyan
    
    # Display critical fields
    Write-Host "  Message: $($payrollResponse.message)" -ForegroundColor Green
    Write-Host "  Email Sent: $($payrollResponse.emailSent)" -ForegroundColor $(if ($payrollResponse.emailSent) { 'Green' } else { 'Red' })
    Write-Host "  Notification Sent: $($payrollResponse.notificationSent)" -ForegroundColor $(if ($payrollResponse.notificationSent) { 'Green' } else { 'Red' })
    
    if ($payrollResponse.payload) {
        Write-Host "`n  Payroll Details:" -ForegroundColor Yellow
        Write-Host "    - Employee Name: $($payrollResponse.payload.employeeName)" -ForegroundColor Gray
        Write-Host "    - Net Salary: $($payrollResponse.payload.netSalary)" -ForegroundColor Gray
        Write-Host "    - Month/Year: $($payrollResponse.payload.month)/$($payrollResponse.payload.year)" -ForegroundColor Gray
        Write-Host "    - Payroll ID: $($payrollResponse.payload.id)" -ForegroundColor Gray
    }
    
    if ($payrollResponse.emailSent) {
        Write-Success "✨ EMAIL SENT TO: $empEmail"
    } else {
        Write-Error "Email sending failed - check backend logs"
    }
    
} catch {
    Write-Error "Payroll generation failed: $($_.Exception.Message)"
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
    exit 1
}

# Step 6: Verification
Write-Header "Step 6: ✅ Verification Checklist"

$checks = @(
    @{ name = "Payroll Generated"; status = $payrollResponse.id -ne $null }
    @{ name = "Email Sent"; status = $payrollResponse.emailSent -eq $true }
    @{ name = "Notification Sent"; status = $payrollResponse.notificationSent -eq $true }
    @{ name = "Message Received"; status = $payrollResponse.message -ne $null }
)

$allPassed = $true
foreach ($check in $checks) {
    $symbol = if ($check.status) { "✅" } else { "❌" }
    $color = if ($check.status) { "Green" } else { "Red" }
    Write-Host "  $symbol $($check.name)" -ForegroundColor $color
    if (-not $check.status) { $allPassed = $false }
}

# Step 7: Final Instructions
Write-Header "Step 7: 📧 Next Steps"

if ($payrollResponse.emailSent) {
    Write-Success "Email has been sent!"
    Write-Info "Check the inbox at: $empEmail"
    Write-Info "Expected email subject: Payroll Generated - $month/$year"
    Write-Info "Gmail might take 1-5 minutes to deliver"
    Write-Info "Check spam folder if not received in inbox"
    Write-Success "`n🎉 TEST COMPLETED SUCCESSFULLY!`n"
} else {
    Write-Error "Email was NOT sent - there may be a configuration issue"
    Write-Info "Check backend console logs above for error details"
    Write-Info "Ensure these .env variables are set:"
    Write-Host "  - MAIL_HOST=smtp.gmail.com" -ForegroundColor Gray
    Write-Host "  - MAIL_USER=ramjeekumaryadav733@gmail.com" -ForegroundColor Gray
    Write-Host "  - MAIL_PASS=(16-char app password)" -ForegroundColor Gray
}

# Display full response for debugging
Write-Header "📋 Full API Response (JSON)"
Write-Host (ConvertTo-Json $payrollResponse -Depth 10) -ForegroundColor DarkGray
