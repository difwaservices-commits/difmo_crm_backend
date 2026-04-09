import * as bcrypt from 'bcryptjs';

async function testBcryptPasswords() {
  console.log('--- Testing bcrypt password hashing ---\n');

  const adminPassword = 'password123';
  const employeePassword = 'welcome123';

  // Hash both passwords
  const adminHash = await bcrypt.hash(adminPassword, 10);
  const employeeHash = await bcrypt.hash(employeePassword, 10);

  console.log(`Admin Password: "${adminPassword}"`);
  console.log(`Admin Hash: ${adminHash}`);
  const adminMatch = await bcrypt.compare(adminPassword, adminHash);
  console.log(`Admin bcrypt.compare result: ${adminMatch}\n`);

  console.log(`Employee Password: "${employeePassword}"`);
  console.log(`Employee Hash: ${employeeHash}`);
  const employeeMatch = await bcrypt.compare(employeePassword, employeeHash);
  console.log(`Employee bcrypt.compare result: ${employeeMatch}\n`);

  // Test with wrong password
  console.log('Testing with WRONG password for employee:');
  const wrongMatch = await bcrypt.compare('wrong123', employeeHash);
  console.log(`Wrong password match: ${wrongMatch}`);

  console.log('\n--- Tests complete ---');
}

testBcryptPasswords().catch(console.error);
