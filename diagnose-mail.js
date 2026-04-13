/**
 * Diagnostic Script for Mail Service Configuration
 * Checks if SMTP credentials are properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(60));
console.log('MAIL SERVICE CONFIGURATION DIAGNOSTIC');
console.log('='.repeat(60) + '\n');

// Check required env variables
const requiredEnvVars = [
    'MAIL_HOST',
    'MAIL_PORT',
    'MAIL_USER',
    'MAIL_PASS',
];

console.log('📋 Checking Environment Variables...\n');

let allConfigured = true;
const envConfig = {};

requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    const status = value ? '✅' : '❌';
    const displayValue = value ? (varName.includes('PASS') ? '***' + value.slice(-4) : value) : 'NOT SET';

    console.log(`${status} ${varName}: ${displayValue}`);

    if (!value) {
        allConfigured = false;
    }
    envConfig[varName] = !!value;
});

console.log('\n' + '='.repeat(60));

if (allConfigured) {
    console.log('✅ All mail configuration variables are set!\n');
} else {
    console.log('❌ Some mail configuration variables are missing!\n');
    console.log('📝 Required Configuration (.env file):\n');
    console.log(`MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-specific-password`);
    console.log('\n📚 Gmail Setup Instructions:');
    console.log('1. Enable 2-Step Verification in Google Account');
    console.log('2. Generate App Password: https://myaccount.google.com/apppasswords');
    console.log('3. Use the 16-character password in MAIL_PASS\n');
}

// Check .env file
console.log('📁 Checking for .env file...\n');
const envFile = path.join(__dirname, '.env');
const envLocalFile = path.join(__dirname, '.env.local');

if (fs.existsSync(envFile)) {
    console.log('✅ Found: ' + envFile);
} else {
    console.log('❌ Not found: ' + envFile);
}

if (fs.existsSync(envLocalFile)) {
    console.log('✅ Found: ' + envLocalFile);
} else {
    console.log('❌ Not found: ' + envLocalFile);
}

console.log('\n' + '='.repeat(60));
console.log('📧 Email Service Status For: ramjeekumaryadav558@gmail.com\n');

if (process.env.MAIL_USER === 'ramjeekumaryadav558@gmail.com') {
    console.log('✅ MAIL_USER is configured for ramjeekumaryadav558@gmail.com');
    console.log('✅ Emails should be sent FROM this address');
    console.log('✅ Ready for payroll email testing!\n');
} else if (process.env.MAIL_USER) {
    console.log(`⚠️  MAIL_USER is set to: ${process.env.MAIL_USER}`);
    console.log('📝 To send from ramjeekumaryadav558@gmail.com, update:');
    console.log('   MAIL_USER=ramjeekumaryadav558@gmail.com\n');
} else {
    console.log('❌ MAIL_USER is not configured');
    console.log('📝 Set MAIL_USER=ramjeekumaryadav558@gmail.com in .env\n');
}

// Test configuration
console.log('='.repeat(60));
console.log('🧪 Mail Configuration Summary:\n');

const config = {
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: process.env.MAIL_PORT || 465,
    user: process.env.MAIL_USER || 'NOT SET',
    secured: true,
    tlsRejectUnauthorized: false,
};

console.log(JSON.stringify(config, null, 2));

console.log('\n' + '='.repeat(60));
console.log('✅ NEXT STEPS:\n');
console.log('1. Verify all MAIL_* environment variables are set');
console.log('2. Make sure Gmail App Password is generated (2FA required)');
console.log('3. Run: npm start (backend server)');
console.log('4. Run: node test-payroll-email.js (to test sending)');
console.log('5. Check console logs for email confirmation messages\n');
console.log('='.repeat(60) + '\n');
