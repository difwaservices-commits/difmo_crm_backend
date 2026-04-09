const http = require('http');

const options = {
  hostname: 'difmo-crm-backend.vercel.app',
  port: 3000,
  path: '/public/jobs',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const jobs = JSON.parse(data);
      console.log('Status:', res.statusCode);
      console.log('Total jobs:', Array.isArray(jobs) ? jobs.length : 'Not an array');
      if (Array.isArray(jobs) && jobs.length > 0) {
        console.log('\nFirst job sample:');
        console.log(JSON.stringify(jobs[0], null, 2));
      }
    } catch (e) {
      console.log('Response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem: ${e.message}`);
});

req.end();
