const axios = require('axios');

async function checkMetrics() {
  const baseURL = 'https://difmo-crm-backend.vercel.app';
  
  try {
    console.log('--- LOGGING IN ---');
    const loginRes = await axios.post(`${baseURL}/auth/login`, {
      email: 'admin@difmo.com',
      password: 'password123'
    });
    
    const token = loginRes.data.data.access_token;
    const companyId = loginRes.data.data.user.company.id;
    
    console.log('Token received. Company ID:', companyId);
    
    console.log('\n--- FETCHING METRICS ---');
    const metricsRes = await axios.get(`${baseURL}/dashboard/metrics`, {
      params: { companyId },
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Metrics Response:');
    console.log(JSON.stringify(metricsRes.data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

checkMetrics();
