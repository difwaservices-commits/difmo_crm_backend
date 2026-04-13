# Payroll Email Testing Guide
## Testing ramjeekumaryadav558@gmail.com

### 📋 Prerequisites

1. **Backend running**: `npm start` (in `difmo_crm_backend` directory)
2. **Frontend running**: `npm start` (in `difmo_crm_frontend` directory)  
3. **Gmail credentials configured**: Check `.env` file for MAIL_* variables
4. **Auth token**: From browser LocalStorage after login

---

## ✅ Step-by-Step Testing (Windows - PowerShell)

### 1️⃣ Verify Mail Configuration
```powershell
cd difmo_crm_backend
node diagnose-mail.js
```

**What to check:**
- ✅ All MAIL_* environment variables should show values
- ✅ MAIL_USER should be a valid Gmail address
- ✅ MAIL_PASS should be masked (***...)

**If missing variables:**
```
Edit .env file and add:
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-specific-password
```

---

### 2️⃣ Get Auth Token
1. Open the CRM application in browser (usually http://localhost:3000)
2. Login with your credentials
3. Press `F12` to open Developer Tools
4. Go to **Storage** → **LocalStorage**
5. Find the key `token` and copy its full value
6. Save it (you'll need it for next step)

---

### 3️⃣ Run Payroll Email Test

**Option A: Using PowerShell (Recommended for Windows)**
```powershell
cd difmo_crm_backend
.\test-payroll-email.ps1 -Token "paste-your-token-here"
```

**Option B: Using Node.js**
```powershell
cd difmo_crm_backend
$env:AUTH_TOKEN="paste-your-token-here"
node test-payroll-email.js
```

**Option C: Using cURL (Windows 10+)**
```powershell
cd difmo_crm_backend
.\test-payroll-email.sh your-token
```

---

## 📧 What to Expect

### ✅ Success Output
The script will show:
```
✅ Fetched 15 employees
✅ Found employee:
  Name: Ramjeekumar Yadav
  Email: ramjeekumaryadav558@gmail.com
  Salary: 50000
  Designation: Developer
  ID: 12345

✅ Found 25 attendance records
✅ Payroll generated successfully!
```

### 📝 Backend Console Logs
Check the backend terminal where you ran `npm start`:

**Expected messages (SUCCESS):**
```
[FinanceService] ✅ Email sent to employee 12345 (ramjeekumaryadav558@gmail.com)
[FinanceService] Notification sent to employee 12345
Payroll Generated successfully with notifications
```

**If you see errors (FAILURE):**
```
[FinanceService] ⚠️ No email found for employee 12345
[FinanceService] ❌ Failed to send payroll email to employee 12345: EAUTH...
[FinanceService] Failed to notify employee 12345: ...
```

---

## 🔍 Troubleshooting

### ❌ "Invalid Credentials" Error
**Problem:** Gmail is rejecting the MAIL_PASS

**Solution:**
1. Ensure 2-Factor Authentication is enabled on Gmail
2. Generate a new App Password:
   - Visit: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows"
   - Copy the 16-character password
3. Update `.env` with new password
4. Restart backend: `npm start`

### ❌ "Employee not found" Error
**Problem:** Email `ramjeekumaryadav558@gmail.com` doesn't exist in system

**Solution:**
1. Check if employee is created in the system
2. Go to Employees page in CRM
3. Create employee with this email OR
4. Use a different employee's email for testing

### ❌ "No attendance records" Error
**Problem:** Employee has no attendance records

**Solution:**
1. Create attendance records for the employee
2. Go to Attendance → Mark attendance for the employee
3. After marking, run the test again

### ❌ "ENOTFOUND smtp.gmail.com" Error
**Problem:** Network issue connecting to Gmail

**Solution:**
1. Check internet connection
2. Check MAIL_HOST is set to `smtp.gmail.com`
3. Check MAIL_PORT is set to `465`
4. Restart backend

### ❌ "401 Unauthorized" Error
**Problem:** Auth token is invalid or expired

**Solution:**
1. Logout from CRM application
2. Clear browser cache/localStorage
3. Login again
4. Get fresh token from LocalStorage
5. Run test again with new token

---

## 📊 Complete Test Workflow

```
Step 1: Verify Configuration
  └─ node diagnose-mail.js

Step 2: Login to CRM
  └─ Get auth token from LocalStorage

Step 3: Run Payroll Test
  └─ .\test-payroll-email.ps1 -Token "token"

Step 4: Check Results
  └─ Look for ✅ messages in output
  └─ Check backend console for confirmation

Step 5: Verify Email Sent
  └─ Check recipient's inbox (ramjeekumaryadav558@gmail.com)
  └─ Or check spam folder
```

---

## 📝 Payroll Email Template

The email sent will look like:
```
Subject: Payroll Generated - 4/2026

Dear Ramjeekumar,

Your payroll for April 2026 has been generated.

Net Salary: ₹47,500.00

Please contact HR for any questions.

This is an automated message.
```

---

## 🎯 Success Checklist

- [ ] Mail configuration verified with `diagnose-mail.js`
- [ ] Auth token obtained from browser LocalStorage
- [ ] PowerShell test script ran successfully
- [ ] ✅ messages shown for employee and attendance
- [ ] Backend console shows email sent confirmation
- [ ] Email received in inbox (or spam folder)

---

## 📞 Quick Reference

| File | Purpose |
|------|---------|
| `diagnose-mail.js` | Check mail configuration |
| `test-payroll-email.ps1` | PowerShell test script |
| `test-payroll-email.js` | Node.js test script |
| `test-payroll-email.sh` | Bash/Shell test script |

---

## 🔧 Manual Testing (API)

If you prefer to test via API directly:

### 1. Find Employee ID
```
GET http://localhost:3000/employees
Headers: Authorization: Bearer {token}
```

### 2. Find Attendance ID  
```
GET http://localhost:3000/attendance?employeeId={employee_id}
Headers: Authorization: Bearer {token}
```

### 3. Generate Payroll (This sends email!)
```
POST http://localhost:3000/finance/generate
Headers: 
  - Authorization: Bearer {token}
  - Content-Type: application/json
Body:
{
  "attendanceId": "attendance-id",
  "month": 4,
  "year": 2026
}
```

Expected Response:
```json
{
  "message": "Payroll Generated successfully with notifications",
  "payroll": {
    "id": "payroll-id",
    "employeeId": "employee-id",
    "employeeName": "Ramjeekumar Yadav",
    "netSalary": 47500,
    "month": 4,
    "year": 2026,
    "emailSent": true,
    "notificationSent": true
  }
}
```

---

## ✉️ Email Sending Flow

```
1. POST /finance/generate
   ↓
2. generatePayroll() method starts
   ↓
3. Find Attendance + Employee + User data
   ↓
4. Calculate Payroll
   ↓
5. Save to Database
   ↓
6. Send Notification 🔔
   ↓
7. Send Email 📧 (MailService.sendPayrollEmail)
   ↓
8. Return Response with emailSent: true
```

---

Generated: April 13, 2026
Last Updated: Payroll Email Testing Implementation
