/**
 * Test script to verify payroll email sending for ramjeekumaryadav558@gmail.com
 * Run: node test-payroll-email.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const API_ENDPOINTS = {
    EMPLOYEES: '/employees',
    FINANCE: '/finance',
};

// Color codes for console
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

const log = {
    info: (msg) => console.log(`${colors.blue}ℹ️ ${msg}${colors.reset}`),
    success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    warning: (msg) => console.log(`${colors.yellow}⚠️ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    step: (msg) => console.log(`\n${colors.cyan}${colors.bright}→ ${msg}${colors.reset}`),
    section: (msg) => console.log(`\n${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓${colors.reset}\n${colors.bright}${msg}${colors.reset}\n${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛${colors.reset}\n`),
};

let globalToken = null;

// Step 1: Login or get token from env
async function getAuthToken() {
    log.step('Getting authentication token...');

    const token = process.env.AUTH_TOKEN;
    if (token) {
        log.success(`Using token from environment`);
        globalToken = token;
        return token;
    }

    // Try to login with test credentials
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'admin@difmo.com',
            password: 'Admin@123'
        });
        globalToken = response.data.data?.access_token || response.data.access_token;
        log.success(`Logged in successfully. Token: ${globalToken.substring(0, 20)}...`);
        return globalToken;
    } catch (err) {
        log.error(`Failed to get auth token: ${err.message}`);
        log.info(`Set AUTH_TOKEN environment variable or use valid credentials`);
        process.exit(1);
    }
}

// Step 2: Find employee with specific email
async function findEmployeeByEmail(email) {
    log.step(`Finding employee with email: ${email}`);

    try {
        const response = await axios.get(`${BASE_URL}${API_ENDPOINTS.EMPLOYEES}`, {
            headers: { Authorization: `Bearer ${globalToken}` }
        });

        const employees = Array.isArray(response.data.data) ? response.data.data : response.data;

        if (!Array.isArray(employees)) {
            log.error(`Unexpected response format: ${JSON.stringify(employees).substring(0, 100)}`);
            return null;
        }

        const employee = employees.find(emp =>
            emp.user?.email === email || emp.email === email
        );

        if (employee) {
            log.success(`Found employee:`);
            console.log({
                id: employee.id,
                name: `${employee.user?.firstName} ${employee.user?.lastName}`,
                email: employee.user?.email || employee.email,
                salary: employee.salary,
                designation: employee.designation,
            });
            return employee;
        } else {
            log.warning(`No employee found with email: ${email}`);
            log.info(`Available employees:`);
            employees.slice(0, 5).forEach(emp => {
                console.log(`  - ${emp.user?.firstName} ${emp.user?.lastName} (${emp.user?.email})`);
            });
            return null;
        }
    } catch (err) {
        log.error(`Failed to fetch employees: ${err.message}`);
        if (err.response?.status === 401) {
            log.warning(`Authentication failed - token may be invalid`);
        }
        return null;
    }
}

// Step 3: Get latest attendance for employee
async function getEmployeeAttendance(employeeId) {
    log.step(`Fetching attendance for employee ID: ${employeeId}`);

    try {
        const response = await axios.get(`${BASE_URL}/attendance`, {
            params: { employeeId },
            headers: { Authorization: `Bearer ${globalToken}` }
        });

        const attendances = Array.isArray(response.data.data) ? response.data.data : response.data;

        if (!Array.isArray(attendances) || attendances.length === 0) {
            log.warning(`No attendance records found for employee`);
            return null;
        }

        const latest = attendances[0];
        log.success(`Found ${attendances.length} attendance records`);
        console.log({
            id: latest.id,
            date: latest.date,
            status: latest.status,
            checkInTime: latest.checkInTime,
            checkOutTime: latest.checkOutTime,
        });
        return latest;
    } catch (err) {
        log.error(`Failed to fetch attendance: ${err.message}`);
        return null;
    }
}

// Step 4: Generate payroll
async function generatePayroll(attendanceId) {
    log.step(`Generating payroll for attendance ID: ${attendanceId}`);

    try {
        const response = await axios.post(
            `${BASE_URL}${API_ENDPOINTS.FINANCE}/generate`,
            {
                attendanceId: attendanceId,
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear()
            },
            { headers: { Authorization: `Bearer ${globalToken}` } }
        );

        const payroll = response.data.data || response.data;
        log.success(`Payroll generated successfully`);
        console.log(JSON.stringify(payroll, null, 2));
        return payroll;
    } catch (err) {
        log.error(`Failed to generate payroll: ${err.message}`);
        if (err.response?.data) {
            console.error({
                status: err.response.status,
                data: err.response.data
            });
        }
        return null;
    }
}

// Step 5: Check mail logs
async function checkMailLogs() {
    log.step(`Mail sending verification`);
    log.info(`Check the backend console/logs for these messages:`);
    console.log(`
  ${colors.green}✅ [FinanceService] Email sent to employee${colors.reset}
  ${colors.cyan}ℹ️ [FinanceService] Notification sent to employee${colors.reset}
  ${colors.yellow}⚠️ [FinanceService] No email found for employee${colors.reset}
  ${colors.red}❌ [FinanceService] Failed to send payroll email${colors.reset}
    `);
}

// Main execution
async function main() {
    log.section('PAYROLL EMAIL TESTING - ramjeekumaryadav558@gmail.com');

    try {
        // Get token
        await getAuthToken();

        // Find employee
        const employee = await findEmployeeByEmail('ramjeekumaryadav558@gmail.com');
        if (!employee) {
            log.error('Cannot proceed without employee');
            process.exit(1);
        }

        // Get attendance
        const attendance = await getEmployeeAttendance(employee.id);
        if (!attendance) {
            log.warning('No attendance available, but continuing...');
            // We can still test with a mock attendance ID
            // Uncomment below to test with specific ID
            // const mockAttendanceId = 'some-attendance-id';
        }

        if (attendance) {
            // Generate payroll
            const payroll = await generatePayroll(attendance.id);
            if (payroll) {
                checkMailLogs();
            }
        } else {
            log.info('Skipping payroll generation - no attendance record');
        }

        log.section('TEST SUMMARY');
        log.info('Check the backend terminal output for email sending logs');
        log.info('Expected log messages should appear in the payroll generation response');

    } catch (err) {
        log.error(`Unexpected error: ${err.message}`);
        console.error(err);
        process.exit(1);
    }
}

// Run
main().catch(err => {
    log.error(err.message);
    process.exit(1);
});
