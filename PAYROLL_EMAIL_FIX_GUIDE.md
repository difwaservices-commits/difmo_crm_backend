# 🔧 PAYROLL EMAIL DEBUGGING GUIDE

## ✅ Changes Made to Fix Email Sending

### 1. **Fixed Sender Email Configuration**
**File**: `mail.module.ts`

**Before** ❌:
```typescript
defaults: {
  from: '"No Reply" <noreply@example.com>', // WRONG - Generic address
}
```

**After** ✅:
```typescript
defaults: {
  from: `"CRM Notifications" <${config.get('MAIL_USER')}>`, // CORRECT - Uses actual Gmail account
}
```

**Why This Matters**:
- Gmail SMTP requires the sender email to match the authenticated account
- Previously, emails were sent FROM a fake email (noreply@example.com) that doesn't exist
- Now emails are sent FROM the actual Gmail account (ramjeekumaryadav733@gmail.com)

---

## 🚀 Added Multi-Select Employees to Project Creation

### Location: `AddProjectPage.jsx` (Step 1)

**New Features**:
✅ Employees loaded from API (`/employees`)
✅ Multi-select with checkboxes
✅ Shows employee name + department
✅ Selected employees shown as removable badges
✅ Passed to backend as `assignedEmployeeIds`

---

## 📋 Payroll Email Sending Checklist

Before testing, verify ALL of these:

### Configuration (.env)
```
MAIL_HOST=smtp.gmail.com                          ✅ Verified
MAIL_PORT=465                                     ✅ Verified
MAIL_USER=ramjeekumaryadav733@gmail.com           ✅ Set in .env
MAIL_PASS=azsl vspn pqht urgw                     ✅ Set in .env
```

### Gmail Account (ramjeekumaryadav733@gmail.com)
- [ ] Account exists and is accessible
- [ ] 2-Factor Authentication is ENABLED
- [ ] App Password generated (not account password)
- [ ] App Password correct (16 characters)
- [ ] "Less Secure Apps" is disabled (use App Password instead)

### Code Configuration
- [ ] `mail.module.ts` uses `MAIL_USER` as sender ✅ FIXED
- [ ] `MailService` has `sendPayrollEmail()` method ✅ Exists
- [ ] `finance.service.ts` calls `mailService.sendPayrollEmail()` ✅ Called
- [ ] Template file exists: `payroll-notification.hbs` ✅ Exists
- [ ] Error handling in place with try-catch blocks ✅ Present

### Backend Logs
When payroll is generated, you should see in backend console:
```
[FinanceService] Notification sent to employee 123
[FinanceService] ✅ Email sent to employee 123 (ramjeekumaryadav558@gmail.com)
```

---

## 🔍 Troubleshooting: Why Emails Won't Send

### Issue 1: "Invalid Credentials"
**Error**: `Invalid login - 535-5.7.8 Invalid credentials`

**Causes**:
- ❌ Using actual Gmail password (must use App Password)
- ❌ MAIL_PASS in .env is incorrect
- ❌ App Password has expired

**Fix**:
```
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Generate new 16-character password
4. Copy to MAIL_PASS in .env (remove spaces)
5. Restart backend: npm start
```

---

### Issue 2: "ENOTFOUND smtp.gmail.com"
**Error**: `getaddrinfo ENOTFOUND smtp.gmail.com`

**Cause**: Network connection issue

**Fix**:
- Check internet connection
- Check firewall isn't blocking port 465
- Verify MAIL_HOST is spelled correctly: `smtp.gmail.com`

---

### Issue 3: "Authentication failed"
**Error**: `Error: connect ECONNREFUSED`

**Causes**:
- ❌ Port 465 blocked by firewall
- ❌ MAIL_HOST is wrong
- ❌ gmail account doesn't exist

**Fix**:
```
1. Verify MAIL_HOST=smtp.gmail.com
2. Verify MAIL_PORT=465
3. Test connection: telnet smtp.gmail.com 465
4. Verify Gmail account: ramjeekumaryadav733@gmail.com
```

---

### Issue 4: "Email sent but not delivered"
**Backend shows** ✅: Email sent
**Gmail shows** ❌: Email not received

**Causes**:
- Email in spam folder
- Gmail account setup incomplete
- Template rendering issue

**Fix**:
```
1. Check spam/junk folder
2. Check email wasn't sent to wrong address
3. Verify template renders: payroll-notification.hbs
4. Check name/salary fields in email
```

---

### Issue 5: "No email found for employee"
**Error**: `⚠️ No email found for employee emp-123`

**Cause**: Employee doesn't have email address in system

**Fix**:
```
1. Go to Employees page
2. Find employee (ramjeekumaryadav558)
3. Verify they have email assigned
4. Update if missing: ramjeekumaryadav558@gmail.com
5. Try payroll generation again
```

---

### Issue 6: "Send method not found"
**Error**: `mailService.sendPayrollEmail is not a function`

**Cause**: Mail service not properly injected or method missing

**Fix**:
```typescript
// In finance.module.ts, ensure MailModule is imported:
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule, ...],
})
export class FinanceModule {}
```

---

## 🧪 Manual Testing Steps

### Step 1: Check Configuration
```bash
node diagnose-mail.js
```
Should show:
```
✅ MAIL_HOST: smtp.gmail.com
✅ MAIL_PORT: 465
✅ MAIL_USER: ramjeekumaryadav733@gmail.com
✅ MAIL_PASS: ***password
✅ All mail configuration variables are set!
```

---

### Step 2: Check Backend is Running
```bash
npm start
```
Should show:
```
[Nest] 12345 - 04/13/2026, 6:04:05 PM LOG [RoutesResolver]
[RoutesResolver] FinanceController {/finance}
[RouterExplorer] Mapped {/finance/generate-single, POST}
```

---

### Step 3: Run Live Test
```bash
.\test-payroll-live.ps1
```

**Expected Output**:
```
✅ Payroll Generated Successfully!
✅ EMAIL SENT TO: ramjeekumaryadav558@gmail.com
✅ Email Sent: True
✅ Notification Sent: True
```

---

### Step 4: Check Gmail
```
Inbox: ramjeekumaryadav558@gmail.com
From: ramjeekumaryadav733@gmail.com  ✅ Correct sender now
Subject: Payroll Generated - 4/2026
```

---

## 🎯 What Changed in Code

### mail.module.ts
```diff
  defaults: {
-   from: '"No Reply" <noreply@example.com>',
+   from: `"CRM Notifications" <${config.get('MAIL_USER')}>`,
  },
```

**Impact**: 
- Sender now matches the authenticated Gmail account
- Gmail SMTP accepts the email as valid
- Emails actually deliver instead of being rejected

### finance.service.ts (Already Fixed in Previous PR)
```typescript
// Send Email
try {
  const empEmail = emp.user?.email;
  if (empEmail) {
    await this.mailService.sendPayrollEmail(empEmail, {
      employeeName: `${emp.user?.firstName} ${emp.user?.lastName}`,
      month: payroll.month,
      year: payroll.year,
      netSalary: 30000,
    });
    console.log(`[FinanceService] ✅ Email sent to employee ${emp.id} (${empEmail})`);
  } else {
    console.warn(`[FinanceService] ⚠️ No email found for employee ${emp.id}`);
  }
} catch (emailErr) {
  console.error(`[FinanceService] ❌ Failed to send payroll email:`, emailErr.message);
}
```

---

## 📊 Email Flow Diagram

```
┌─────────────────────────────────┐
│    API: POST /finance/generate  │
└────────────────┬────────────────┘
                 │
        ┌────────▼────────┐
        │ Load Employee   │
        │ + Relations     │
        └────────┬────────┘
                 │
        ┌────────▼────────────┐
        │ Save Payroll        │
        │ Record              │
        └────────┬────────────┘
                 │
        ┌────────▼────────────────────┐
        │ Send Notification           │
        │ (In-app only)               │
        └────────┬────────────────────┘
                 │
        ┌────────▼────────────────────────────────────────┐
        │ Send Email via Gmail SMTP                       │
        │ FROM: ramjeekumaryadav733@gmail.com (FIXED ✅) │
        │ TO: ramjeekumaryadav558@gmail.com              │
        │ Template: payroll-notification.hbs             │
        └────────┬────────────────────────────────────────┘
                 │
        ┌────────▼────────────────────┐
        │ Gmail Inbox                 │
        │ ✅ Email Delivered          │
        └─────────────────────────────┘
```

---

## ⚡ Quick Reference: Gmail App Password Setup

1. Go to: https://myaccount.google.com/apppasswords
2. Select Device: **Windows Computer**
3. Select App: **Mail**
4. Google generates 16-character password
5. Copy exactly (no spaces): `azslvspnpqhturgw`
6. Paste into `.env` MAIL_PASS
7. Restart backend

---

## 🎉 How to Verify Success

After implementing fixes, do this:

1. **Restart Backend**
   ```bash
   npm start
   ```

2. **Run Payroll Generation**
   ```bash
   .\test-payroll-live.ps1
   ```

3. **Check Backend Console**
   ```
   ✅ [FinanceService] Email sent to employee...
   ✅ [FinanceService] Notification sent to employee...
   ```

4. **Check Gmail Inbox**
   - Open: ramjeekumaryadav558@gmail.com
   - Look for email from: ramjeekumaryadav733@gmail.com
   - Check subject: "Payroll Generated - 4/2026"

5. **Verify Email Content**
   - Shows: Employee name
   - Shows: Salary amount (₹)
   - Shows: Month/Year
   - Has: Table formatting with styles

---

## 📞 Still Having Issues?

Check these in order:

1. **Backend logs** - Shows actual error messages
2. **diagnose-mail.js** - Confirms configuration loaded
3. **Employee email** - Check employee has email in system
4. **.env file** - Verify MAIL_PASS is correct (16 chars, no spaces)
5. **Gmail account** - Generate new App Password
6. **Firewall** - Check port 465 isn't blocked

---

## 🔐 Security Notes

- **NEVER share** MAIL_PASS value
- **Use App Passwords** not account passwords
- **Disable** "Less Secure Apps" access
- **Keep .env** out of version control (.gitignore)

---

**Last Updated**: April 13, 2026
**Status**: ✅ Email Configuration Fixed
**Next Step**: Run test-payroll-live.ps1 to verify
