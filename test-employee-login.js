const http = require('http');

const testLogin = async () => {
  const loginData = JSON.stringify({
    email: 'testuser1@gmail.com',
    password: 'welcome123'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': loginData.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', chunk => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode === 201 || res.statusCode === 200) {
            console.log('\n✅ LOGIN SUCCESSFUL!\n');
            console.log('Response:', JSON.stringify(response, null, 2));
            resolve(true);
          } else {
            console.log('\n❌ LOGIN FAILED!\n');
            console.log('Status:', res.statusCode);
            console.log('Response:', response);
            resolve(false);
          }
        } catch (e) {
          console.log('\n❌ ERROR parsing response!\n');
          console.log('Body:', body);
          resolve(false);
        }
      });
    });

    req.on('error', (e) => {
      console.error('\n❌ Request error:', e.message);
      reject(e);
    });

    console.log('Testing employee login:');
    console.log('  Email: testuser1@gmail.com');
    console.log('  Password: welcome123');
    console.log('  Endpoint: POST /auth/login\n');
    
    req.write(loginData);
    req.end();
  });
};

console.log('Waiting 3 seconds for server to start...');
setTimeout(() => testLogin().catch(console.error), 3000);
