const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/public/jobs',
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
};

let fullData = '';

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Content-Type:', res.headers['content-type']);
  
  res.on('data', (chunk) => { fullData += chunk; });
  res.on('end', () => {
    try {
      // Check if response is wrapped
      let parsed = JSON.parse(fullData);
      
      // If TransformInterceptor wrapped it, extract the data
      if (parsed.data && Array.isArray(parsed.data)) {
        parsed = parsed.data;
      } else if (!Array.isArray(parsed) && parsed.data) {
        parsed = parsed.data;
      }
      
      console.log('\n✓ Jobs endpoint working!');
      console.log('Total jobs:', Array.isArray(parsed) ? parsed.length : '1 job object');
      
      if (Array.isArray(parsed) && parsed.length > 0) {
        const firstJob = parsed[0];
        console.log('\n📋 First Job (sample):');
        console.log(JSON.stringify(firstJob, null, 2).substring(0, 1000) + '...');
        
        // Check for new fields
        console.log('\n✓ New Fields Check:');
        console.log('  - slug:', firstJob.slug ? '✓' : '✗');
        console.log('  - responsibilities:', Array.isArray(firstJob.responsibilities) ? '✓' : '✗');
        console.log('  - requirements:', Array.isArray(firstJob.requirements) ? '✓' : '✗');
        console.log('  - applicationStartDate:', firstJob.applicationStartDate ? '✓' : '✗');
        console.log('  - applicationEndDate:', firstJob.applicationEndDate ? '✓' : '✗');
        console.log('  - isActive:', typeof firstJob.isActive === 'boolean' ? '✓' : '✗');
      }
    } catch (e) {
      console.error('Failed to parse response:', e.message);
      console.log('Raw:', fullData.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Connection error:', e.message);
  console.error('Make sure backend is running on http://localhost:3000');
});

req.end();
