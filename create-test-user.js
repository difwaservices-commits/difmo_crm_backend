#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, 'db.sqlite');
const db = new sqlite3.Database(dbPath);

// Test user credentials
const testUser = {
    email: 'admin@test.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User'
};

console.log('\n🔧 Creating Test User...\n');

async function createTestUser() {
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    const userId = require('crypto').randomUUID();

    // Check if user already exists
    db.get('SELECT * FROM user WHERE email = ?', [testUser.email], (err, existingUser) => {
        if (err) {
            console.error('Error checking user:', err);
            db.close();
            return;
        }

        if (existingUser) {
            console.log('⚠️  User already exists with email:', testUser.email);
            console.log('\n📝 Updating password...\n');

            db.run(
                'UPDATE user SET password = ? WHERE email = ?',
                [hashedPassword, testUser.email],
                (err) => {
                    if (err) {
                        console.error('Error updating user:', err);
                    } else {
                        console.log('✅ Password updated successfully!\n');
                        console.log('📧 Email:', testUser.email);
                        console.log('🔑 Password:', testUser.password);
                    }
                    db.close();
                }
            );
        } else {
            // Check for company or create one
            db.get('SELECT id FROM company LIMIT 1', [], (err, company) => {
                if (err) {
                    console.error('Error checking company:', err);
                    db.close();
                    return;
                }

                const createCompanyAndUser = (companyId) => {
                    const userId = require('crypto').randomUUID(); // Generate new ID for user
                    db.run(
                        `INSERT INTO user (id, email, password, firstName, lastName, isActive, createdAt, updatedAt, companyId)
                         VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), ?)`,
                        [userId, testUser.email, hashedPassword, testUser.firstName, testUser.lastName, 1, companyId],
                        function (err) {
                            if (err) {
                                console.error('Error creating user:', err);
                                db.close();
                                return;
                            }
                            printSuccess();
                        }
                    );
                };

                if (!company) {
                    console.log('🏢 Creating default company...');
                    const companyId = require('crypto').randomUUID();
                    db.run(
                        `INSERT INTO company (id, name, email, phone, address, website, industry, size, foundedYear, status, createdAt, updatedAt)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
                        [companyId, 'Difmo Tech', 'contact@difmo.com', '1234567890', '123 Tech St', 'https://difmo.com', 'Technology', '10-50', 2020, 'active'],
                        (err) => {
                            if (err) {
                                console.error('Error creating company:', err);
                                db.close();
                                return;
                            }
                            createCompanyAndUser(companyId);
                        }
                    );
                } else {
                    createCompanyAndUser(company.id);
                }
            });
        }
    });
}

function printSuccess() {
    console.log('✅ Test user created successfully!\n');
    console.log('='.repeat(50));
    console.log('📧 Email:', testUser.email);
    console.log('🔑 Password:', testUser.password);
    console.log('='.repeat(50));
    console.log('\nYou can now login with these credentials!\n');
    db.close();
}

createTestUser();
