#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'db.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('\n📊 DATABASE VISUALIZATION\n');
console.log('='.repeat(80));

// Get all users with their roles
db.all(`
  SELECT 
    u.id,
    u.email,
    u.firstName,
    u.lastName,
    u.phone,
    u.isActive,
    GROUP_CONCAT(r.name) as roles
  FROM user u
  LEFT JOIN user_roles_role urr ON u.id = urr.userId
  LEFT JOIN role r ON urr.roleId = r.id
  GROUP BY u.id
`, [], (err, users) => {
    if (err) {
        console.error('Error fetching users:', err);
        return;
    }

    console.log('\n👥 USERS:\n');
    if (users.length === 0) {
        console.log('  No users found in database.');
    } else {
        users.forEach((user, index) => {
            console.log(`  ${index + 1}. ${user.firstName} ${user.lastName}`);
            console.log(`     Email: ${user.email}`);
            console.log(`     Phone: ${user.phone || 'N/A'}`);
            console.log(`     Roles: ${user.roles || 'No roles assigned'}`);
            console.log(`     Active: ${user.isActive ? '✅' : '❌'}`);
            console.log(`     ID: ${user.id}`);
            console.log('');
        });
    }

    // Get all companies
    db.all('SELECT * FROM company', [], (err, companies) => {
        if (err) {
            console.error('Error fetching companies:', err);
            return;
        }

        console.log('\n🏢 COMPANIES:\n');
        if (companies.length === 0) {
            console.log('  No companies found in database.');
        } else {
            companies.forEach((company, index) => {
                console.log(`  ${index + 1}. ${company.name}`);
                console.log(`     Email: ${company.email}`);
                console.log(`     Phone: ${company.phone || 'N/A'}`);
                console.log(`     Address: ${company.address || 'N/A'}`);
                console.log(`     ID: ${company.id}`);
                console.log('');
            });
        }

        // Get all roles
        db.all('SELECT * FROM role', [], (err, roles) => {
            if (err) {
                console.error('Error fetching roles:', err);
                return;
            }

            console.log('\n🔐 ROLES:\n');
            if (roles.length === 0) {
                console.log('  No roles found in database.');
            } else {
                roles.forEach((role, index) => {
                    console.log(`  ${index + 1}. ${role.name}`);
                    console.log(`     Description: ${role.description || 'N/A'}`);
                    console.log(`     ID: ${role.id}`);
                    console.log('');
                });
            }

            console.log('='.repeat(80));
            console.log('\n💡 LOGIN CREDENTIALS:\n');
            console.log('  To login, use any of the emails above with their password.');
            console.log('  If you need to reset a password, use the create-test-user.js script.\n');

            db.close();
        });
    });
});
