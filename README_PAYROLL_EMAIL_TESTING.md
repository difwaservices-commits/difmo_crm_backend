# 🧪 PAYROLL EMAIL TESTING SUITE - Complete Setup
## Testing Email: ramjeekumaryadav558@gmail.com

---

## 📦 Testing Files Created

### 1. **quick-test-payroll.ps1** (Recommended)
- **Type**: PowerShell Script (Windows)
- **Purpose**: Automated interactive test workflow
- **Features**:
  - Steps through all checks
  - Gets auth token from user input
  - Runs diagnostics
  - Executes payroll test
  - Shows results summary

**Run**: 
```powershell
cd difmo_crm_backend
.\quick-test-payroll.ps1
```

---

### 2. **diagnose-mail.js**
- **Type**: Node.js Diagnostic Script
- **Purpose**: Verify Gmail/SMTP configuration
- **Checks**:
  - MAIL_HOST environment variable
  - MAIL_PORT configuration
  - MAIL_USER account
  - MAIL_PASS (masked)
  - .env file presence
  - Overall configuration status

**Run**:
```powershell
node diagnose-mail.js
```

**Expected Output**:
```
✅ MAIL_HOST: smtp.gmail.com
✅ MAIL_PORT: 465
✅ MAIL_USER: ramjeekumaryadav558@gmail.com
✅ MAIL_PASS: ***password
✅ All mail configuration variables are set!
```

---

### 3. **test-payroll-email.ps1**
- **Type**: PowerShell Script (Windows - Detailed)
- **Purpose**: Test payroll generation with email sending
- **Features**:
  - Fetches all employees
  - Finds target employee by email
  - Gets attendance records
  - Generates payroll (triggers email)
  - Displays detailed response

**Run**:
```powershell
.\test-payroll-email.ps1 -Token "your-auth-token"
```

---

### 4. **test-payroll-email.js**
- **Type**: Node.js Script
- **Purpose**: Script-based payroll email test
- **Features**:
  - Cross-platform compatible
  - Detailed logging
  - Error handling
  - Color-coded output

**Run**:
```powershell
$env:AUTH_TOKEN="your-token"
node test-payroll-email.js
```

---

### 5. **test-payroll-email.sh**
- **Type**: Bash/Shell Script (Unix/Linux)
- **Purpose**: Testing on Unix-based systems
- **Features**:
  - cURL-based API calls
  - Shell scripting

**Run**:
```bash
bash test-payroll-email.sh your-token
```

---

### 6. **PAYROLL_EMAIL_TESTING.md**
- **Type**: Documentation (Markdown)
- **Purpose**: Complete testing guide and troubleshooting
- **Contains**:
  - Prerequisites
  - Step-by-step instructions
  - Expected outputs
  - Troubleshooting guide
  - Email template info
  - Success checklist

---

### 7. **API_ENDPOINTS_REFERENCE.txt**
- **Type**: API Documentation
- **Purpose**: Complete API endpoint reference for manual testing
- **Contains**:
  - All endpoints with payloads
  - Expected responses
  - Console logs expected
  - cURL commands
  - Postman collection JSON
  - Validation checklist
  - Error troubleshooting by status code

---

## 🚀 Quick Start (3 Steps)

### Step 1: Verify Configuration
```powershell
cd difmo_crm_backend
node diagnose-mail.js
```
✅ Check all variables are green (✅)

### Step 2: Get Auth Token
1. Open http://localhost:3000 → Login
2. Press F12 → Storage → LocalStorage → "token"
3. Copy the full token value

### Step 3: Run Test
```powershell
.\quick-test-payroll.ps1
```
Follow the interactive prompts

---

## ✅ Success Indicators

**API Response Should Show:**
```json
{
  "emailSent": true,          ← Must be TRUE
  "notificationSent": true,   ← Must be TRUE
  "message": "Payroll Generated successfully with notifications"
}
```

**Backend Console Should Show:**
```
✅ [FinanceService] Email sent to employee ramjeekumaryadav558@gmail.com
✅ [FinanceService] Notification sent to employee
Payroll Generated successfully with notifications
```

**Email Should Arrive:**
- Recipient: ramjeekumaryadav558@gmail.com
- Subject: Payroll Generated - 4/2026
- Within: 5 minutes
- Or check: Spam folder

---

## 🔧 Configuration Required (.env)

```sh
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USER=ramjeekumaryadav558@gmail.com
MAIL_PASS=xyzw abcd efgh ijkl
```

**For MAIL_PASS:**
1. Enable 2-Factor Auth on Gmail
2. Visit: https://myaccount.google.com/apppasswords
3. Generate App Password for "Mail" + "Windows"
4. Copy 16-character password
5. Paste into MAIL_PASS (remove spaces)

---

## 📊 Testing Flowchart

```
┌─────────────────────────┐
│  Run quick-test.ps1    │
└────────────┬────────────┘
             │
        ┌────┴─────┐
        │           │
    Checks      Gets Token
   Config       from User
        │           │
        └────┬──────┘
             │
    ┌────────▼──────────┐
    │ Fetches Employees │
    └────────┬──────────┘
             │
    ┌────────▼─────────────────────┐
    │ Finds ramjee@gmail.com        │
    └────────┬─────────────────────┘
             │
    ┌────────▼──────────────┐
    │ Gets Attendance      │
    └────────┬──────────────┘
             │
    ┌────────▼──────────────────────┐
    │ Generates Payroll              │
    │ ↓ SENDS EMAIL ↓               │
    └────────┬──────────────────────┘
             │
    ┌────────▼─────────────────┐
    │ Show Results             │
    │ ✅ Response             │
    │ ✅ Backend Console       │
    │ ⏱️  Wait for Email       │
    └─────────────────────────┘
```

---

## 🐛 Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| "Invalid Credentials" | Generate new Gmail App Password |
| "Employee not found" | Check employee exists in system |
| "ENOTFOUND smtp.gmail.com" | Check internet & firewall |
| "401 Unauthorized" | Get fresh auth token |
| Email not received | Check spam folder or Gmail blocklist |

See **PAYROLL_EMAIL_TESTING.md** for detailed troubleshooting

---

## 🎯 Testing Endpoints

| Endpoint | Method | Purpose | Sends Email? |
|----------|--------|---------|-------------|
| `/employees` | GET | List all employees | ❌ No |
| `/attendance` | GET | Get employee attendance | ❌ No |
| `/finance/generate` | POST | Generate payroll | ✅ **YES** ⚡ |
| `/finance/generate-single` | POST | Single payroll | ✅ **YES** ⚡ |

---

## 📝 Log Examples

### ✅ SUCCESS Logs
```
[FinanceService] Notification sent to employee emp-123
[FinanceService] ✅ Email sent to employee emp-123 (ramjeekumaryadav558@gmail.com)
email: [FinanceService] Email sending completed
Response : "emailSent": true
```

### ❌ FAILURE Logs
```
[FinanceService] ⚠️ No email found for employee emp-123
[FinanceService] ❌ Failed to send payroll email to employee emp-123: EAUTH
```

---

## 🔍 Manual Testing (No Script)

If you prefer to test manually using Postman/cURL:

1. **Login** → Get token
2. **GET** `/employees` → Find employee
3. **GET** `/attendance?employeeId=X` → Get attendance
4. **POST** `/finance/generate` → Generate payroll (SENDS EMAIL!)

See **API_ENDPOINTS_REFERENCE.txt** for exact payloads

---

## ✨ Features Implemented

✅ **Email Sending in Payroll Generation**
- generatePayroll() method - sends email + notification
- generatePayrollSingle() method - sends email + notification
- Proper error handling and logging
- Response includes emailSent flag

✅ **Multi-Select Employee Assignment** (Bonus)
- Projects can have multiple assigned employees
- Backend: Updated ProjectService with employee relations
- Frontend: Multi-select dropdown with checkboxes

✅ **Test Infrastructure**
- Automated test scripts (PowerShell/Node/Bash)
- Diagnostic tools for configuration
- API reference documentation
- Troubleshooting guides

---

## 📅 Last Updated
- **Date**: April 13, 2026
- **Email Tested**: ramjeekumaryadav558@gmail.com
- **Status**: ✅ Ready for Testing

---

## 📞 Support

For issues, check:
1. `PAYROLL_EMAIL_TESTING.md` - Detailed guide
2. `API_ENDPOINTS_REFERENCE.txt` - API details  
3. `diagnose-mail.js` - Configuration check
4. Backend console logs - Actual errors

---

## 🎉 You're All Set!

Run this command to start testing:
```powershell
cd difmo_crm_backend
.\quick-test-payroll.ps1
```

Good luck! 🚀
