const postgres = require('pg');

const connectionString = process.env.DATABASE_URL_PROD || 'postgresql://neondb_owner:npg_EnjzltFx6X2Q@ep-still-shape-a8fph0be-pooler.eastus2.azure.neon.tech/difmocrm_prod?sslmode=require';

const client = new postgres.Client({ connectionString });

async function checkJobs() {
  try {
    await client.connect();
    
    // Check if jobs table exists and has data
    const result = await client.query(`
      SELECT id, title, slug, department, "isActive", "applicationStartDate", "applicationEndDate" 
      FROM jobs 
      LIMIT 5
    `);
    
    console.log('\n✓ Database connected!');
    console.log(`Jobs in database: ${result.rows.length}`);
    
    if (result.rows.length > 0) {
      console.log('\n📋 Sample job from DB:');
      console.log(JSON.stringify(result.rows[0], null, 2));
    } else {
      console.log('\n⚠ No jobs found in database!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkJobs();
