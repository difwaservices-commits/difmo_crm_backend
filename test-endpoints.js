const http = require('http');

// Test data
const tests = [
  {
    name: 'Fetch Jobs (public)',
    method: 'GET',
    path: '/public/jobs',
    auth: false
  },
  {
    name: 'Fetch Messages',
    method: 'GET',
    path: '/jobs/messages',
    auth: true
  },
  {
    name: 'Create Job (public)',
    method: 'POST',
    path: '/public/jobs',
    auth: false,
    body: {
      title: 'Test Job',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time'
    }
  }
];

// Sample JWT token from earlier successful login
const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyMUBnbWFpbC5jb20iLCJzdWIiOiI0OWNhODVhNy05MWQwLTRjZTUtODI5My0zMjA5NjFkNDIyMDEiLCJjb21wYW55SWQiOiI4OWIzY2MzNy03MmRkLTQ3ZWEtYTYxOS0yODJiNmNjN2RkM2MiLCJyb2xlcyI6W3siaWQiOiIzYzJiOTk2OC05NjM0LTQ4ZGUtYmVkNy05MmMzYTNmM2U3NTUiLCJuYW1lIjoiRW1wbG95ZWUiLCJkZXNjcmlwdGlvbiI6IiIsInBlcm1pc3Npb25zIjpbeyJpZCI6IjA5OWZjZjJjLTJlMTctNGYyOC1hMDdkLWNkMTU4MDc0MjAyOSIsImFjdGlvbiI6ImNyZWF0ZSIsInJlc291cmNlIjoidXNlciIsImRlc2NyaXB0aW9uIjoiQ2FuIGNyZWF0ZSB1c2VyIiwiY29uZGl0aW9ucyI6bnVsbH0seyJpZCI6ImM2YWY4ZThiLTI2ZmEtNDFkZS1iNDI5LWU5YmM2M2EzOGZjYyIsImFjdGlvbiI6InJlYWQiLCJyZXNvdXJjZSI6InVzZXIiLCJkZXNjcmlwdGlvbiI6IkNhbiByZWFkIHVzZXIiLCJjb25kaXRpb25zIjpudWxsfSx7ImlkIjoiMzY4NTA2MzgtOTZjYi00MGE3LTkzN2EtNTFkZDFlNmJiOTNmIiwiYWN0aW9uIjoidXBkYXRlIiwicmVzb3VyY2UiOiJ1c2VyIiwiZGVzY3JpcHRpb24iOiJDYW4gdXBkYXRlIHVzZXIiLCJjb25kaXRpb25zIjpudWxsfSx7ImlkIjoiNGI1YmY0MTQtNmUzMC00ZTUwLWE5ZTUtNmNjYjVjYmI4ZDYzIiwiYWN0aW9uIjoiY3JlYXRlIiwicmVzb3VyY2UiOiJlbXBsb3llZSIsImRlc2NyaXB0aW9uIjoiQ2FuIGNyZWF0ZSBlbXBsb3llZSIsImNvbmRpdGlvbnMiOm51bGx9LHsiaWQiOiJlMTIwYWRmZS1iZTg5LTQ4NjUtOGQ1Zi03YzgzNmRlYmQ5NzciLCJhY3Rpb24iOiJyZWFkIiwicmVzb3VyY2UiOiJlbXBsb3llZSIsImRlc2NyaXB0aW9uIjoiQ2FuIHJlYWQgZW1wbG95ZWUiLCJjb25kaXRpb25zIjpudWxsfSx7ImlkIjoiYTk5ZDAyNGUtMGQ0ZC00MmY1LTkwZWEtMDBjMGJhMWZlZjU2IiwiYWN0aW9uIjoidXBkYXRlIiwicmVzb3VyY2UiOiJlbXBsb3llZSIsImRlc2NyaXB0aW9uIjoiQ2FuIHVwZGF0ZSBlbXBsb3llZSIsImNvbmRpdGlvbnMiOm51bGx9LHsiaWQiOiI5Yzc4NGVlNi0xZGNlLTRiZDMtOWExYy0yOWM3YjlkNzE4MGUiLCJhY3Rpb24iOiJjcmVhdGUiLCJyZXNvdXJjZSI6ImF0dGVuZGFuY2UiLCJkZXNjcmlwdGlvbiI6IkNhbiBjcmVhdGUgYXR0ZW5kYW5jZSIsImNvbmRpdGlvbnMiOm51bGx9LHsiaWQiOiI2MmVjMDliMy1hMTllLTQzZTMtOGU4MC02NTliYzAwZjg4OGYiLCJhY3Rpb24iOiJyZWFkIiwicmVzb3VyY2UiOiJhdHRlbmRhbmNlIiwiZGVzY3JpcHRpb24iOiJDYW4gcmVhZCBhdHRlbmRhbmNlIiwiY29uZGl0aW9ucyI6bnVsbH0seyJpZCI6ImZlMmFmNjYxLWJmNjMtNGY0Yi04NjkyLWJmZTgyN2QyOTA1ZSIsImFjdGlvbiI6InVwZGF0ZSIsInJlc291cmNlIjoiYXR0ZW5kYW5jZSIsImRlc2NyaXB0aW9uIjoiQ2FuIHVwZGF0ZSBhdHRlbmRhbmNlIiwiY29uZGl0aW9ucyI6bnVsbH0seyJpZCI6IjA3ZmViYTI2LTNhN2EtNDY0MC1hNGJiLTFlZjI0MDlhODNiMiIsImFjdGlvbiI6InJlYWQiLCJyZXNvdXJjZSI6InBheXJvbGwiLCJkZXNjcmlwdGlvbiI6IkNhbiByZWFkIHBheXJvbGwiLCJjb25kaXRpb25zIjpudWxsfV19XSwiaWF0IjoxNzc1NjU3NTc0LCJleHAiOjE3NzYyNjIzNzR9.XqcuA1P-W_4v8dru0vAHPCtgzfgn8djHNOUVyoUWKpg';

async function runTest(test) {
  return new Promise((resolve) => {
    const data = test.body ? JSON.stringify(test.body) : '';
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: test.path,
      method: test.method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      }
    };

    if (test.auth) {
      options.headers['Authorization'] = `Bearer ${jwtToken}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`\n${test.method} ${test.path}`);
        console.log(`Status: ${res.statusCode}`);
        try {
          const json = JSON.parse(body);
          if (res.statusCode >= 400) {
            console.log('Error:', JSON.stringify(json, null, 2));
          } else {
            console.log('✅ Success - Got data');
            if (json.data && Array.isArray(json.data)) {
              console.log(`   Records: ${json.data.length}`);
            }
          }
        } catch (e) {
          console.log('Body:', body.substring(0, 200));
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      console.log(`\n❌ ${test.method} ${test.path}`);
      console.log('Error:', e.message);
      resolve();
    });

    if (data) req.write(data);
    req.end();
  });
}

async function runAllTests() {
  console.log('=== Testing Jobs & Messages Endpoints ===\n');
  for (const test of tests) {
    await runTest(test);
  }
  console.log('\n=== Tests Complete ===');
}

runAllTests();
