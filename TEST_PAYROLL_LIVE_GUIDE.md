# 🧪 LIVE END-TO-END TEST GUIDE - Payroll Email for ramjeekumaryadav558@gmail.com

## ✅ Prerequisites Verified

Backend Status: **✅ RUNNING** (http://localhost:3000)

Mail Configuration (.env):
- MAIL_HOST: smtp.gmail.com ✅
- MAIL_USER: ramjeekumaryadav733@gmail.com ✅
- MAIL_PASS: azsl vspn pqht urgw ✅
- EMAIL_USER: ramjeekumaryadav733@gmail.com (Sender Account) ✅

---

## 🚀 How to Run the Test

### Step 1: Open PowerShell
```powershell
# Navigate to backend directory
cd "c:\Users\Pc\Documents\DifmoProject\CRM\difmo_crm_backend"
```

### Step 2: Run Test Script
```powershell
.\test-payroll-live.ps1
```

### Step 3: Follow Interactive Prompts
```
Enter admin email: (type admin email you use to login)
Enter admin password: (type password)
```

---

## 📊 What the Script Does (Step by Step)

1. **Login** ➜ Gets authentication token
2. **Fetch Employees** ➜ Lists all employees
3. **Find Target** ➜ Searches for ramjeekumaryadav558@gmail.com
4. **Check Attendance** ➜ Verifies employee has attendance records
5. **Generate Payroll** ➜ **🎯 TRIGGERS EMAIL SENDING**
6. **Verify** ➜ Checks if email was sent (emailSent: true)
7. **Results** ➜ Shows full response JSON

---

## ✨ Expected Success Output

```
✅ Login successful!
✅ Fetched 25 employees
✅ Found employee: Ramjeekumar Yadav
✅ Found 12 attendance records
✅ Payroll Generated Successfully!

📊 RESPONSE DETAILS:
  Message: Payroll Generated successfully with notifications
  Email Sent: True                    ← THIS MUST BE TRUE
  Notification Sent: True              ← THIS MUST BE TRUE

✅ EMAIL SENT TO: ramjeekumaryadav558@gmail.com
```

---

## 🎯 What Happens in Backend Console

Watch the backend console (where `npm start` is running) for these logs:

```
[FinanceService] Processing payroll for employee: ramjeekumaryadav558@gmail.com
[FinanceService] Saving payroll record...
[FinanceService] ✅ Email sent to employee emp-XXX (ramjeekumaryadav558@gmail.com)
[FinanceService] ✅ Notification sent to employee emp-XXX
Payroll Generated successfully with notifications
```

---

## 📧 Check Email Receipt

**After test completes:**

1. **Open Gmail**: ramjeekumaryadav558@gmail.com
2. **Check Inbox** for email:
   - From: ramjeekumaryadav733@gmail.com
   - Subject: Payroll Generated - [Month/Year]
   - Contains: Name, Salary, Month/Year details
3. **If not in inbox**, check **Spam** folder
4. **Expected delivery**: 1-5 minutes from sending

---

## 🔍 Email Content Example

```
Subject: Payroll Generated - 4/2026

Dear Ramjeekumar Yadav,

Your payroll for April 2026 has been processed and is ready.

Details:
- Employee Name: Ramjeekumar Yadav
- Month: April (04)
- Year: 2026
- Net Salary: $50,000.00

Please contact HR for any questions.

Best regards,
Difmo CRM
```

---

## ❌ Troubleshooting If Email Not Sent

### Check 1: Backend Logs
```
❌ If you see:
[FinanceService] ⚠️ No email found for employee emp-123

Solution: Employee doesn't have email in system
```

### Check 2: SMTP Connection
```
❌ If you see:
[Error] Failed to send payroll email: ENOTFOUND smtp.gmail.com

Solution: Network issue - check internet connection
```

### Check 3: Invalid Credentials
```
❌ If you see:
[Error] Failed to send payroll email: Invalid login - 535-5.7.8 Invalid credentials

Solution: Gmail app password is wrong or expired
- Go to: https://myaccount.google.com/apppasswords
- Generate new 16-character app password
- Update MAIL_PASS in .env
- Restart backend: npm start
```

### Check 4: Employee Not Found
```
❌ If script says: Employee not found with email: ramjeekumaryadav558@gmail.com

Solution: Employee doesn't exist in system or has different email
```

---

## 🎯 Test Verification Checklist

After running the script, verify these items:

- [ ] Script completes without errors
- [ ] Shows "✅ Email Sent To: ramjeekumaryadav558@gmail.com"
- [ ] Response contains `"emailSent": true`
- [ ] Response contains `"notificationSent": true`
- [ ] Backend console shows ✅ Email sent confirmation
- [ ] Email arrives in ramjeekumaryadav558@gmail.com inbox within 5 minutes
- [ ] Email contains correct employee name and payroll details

**If all checkboxes are ✅, then the test is SUCCESSFUL!**

---

## 📝 Script Output Files

The script will show:
1. **Console Output** - Colored status messages
2. **Full Response JSON** - Complete API response for debugging
3. **Verification Checklist** - Pass/Fail status for each step

---

## 🔐 Security Notes

- **DO NOT share** the auth token displayed
- **DO NOT share** passwords in test output
- Token is only valid for 24 hours (typically)
- App password is masked in output

---

## 🎉 You're Ready to Test!

```powershell
cd "c:\Users\Pc\Documents\DifmoProject\CRM\difmo_crm_backend"
.\test-payroll-live.ps1
```

**Expected Result**: Email successfully sent to ramjeekumaryadav558@gmail.com ✅

---

## 📞 What's Also Included (Alternative Tools)

If you want to test using other methods:

- `diagnose-mail.js` - Check mail configuration
- `test-payroll-email.js` - Node.js version of this test
- `test-payroll-email.sh` - Bash version (Unix/Linux)
- `PAYROLL_EMAIL_TESTING.md` - Comprehensive guide
- `API_ENDPOINTS_REFERENCE.txt` - API documentation

---

## ⏱️ Expected Timeline

- Script runs: ~5-10 seconds
- Email generation: ~1-2 seconds
- Backend processing: ~1-2 seconds
- Gmail delivery: 1-5 minutes
- **Total test time**: ~10 seconds + waiting for email

---

## 🚀 Let's Go!

Ready? Run this in PowerShell:
```powershell
.\test-payroll-live.ps1
```

Good luck! 🎯
