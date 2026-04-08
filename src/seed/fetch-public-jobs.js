const axios = require('axios');

(async ()=>{
  try{
    const res = await axios.get('http://localhost:3000/public/jobs', { timeout: 5000 });
    console.log(JSON.stringify(res.data, null, 2));
  }catch(err){
    console.error('fetch error', err.message || err);
    process.exit(1);
  }
})();
