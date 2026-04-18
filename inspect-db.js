const { Client } = require('pg');

async function checkTables() {
  const client = new Client({
    connectionString: "postgresql://neondb_owner:npg_EnjzltFx6X2Q@ep-still-shape-a8fph0be-pooler.eastus2.azure.neon.tech/difmocrm_prod?sslmode=require"
  });

  try {
    await client.connect();
    console.log('Connected to database.');

    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('Tables in database:');
    res.rows.forEach(row => console.log(`- ${row.table_name}`));

    // Also check User table columns specifically
    const userCols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'user' OR table_name = 'users'
      ORDER BY table_name, column_name;
    `);
    
    console.log('\nColumns in User/Users:');
    userCols.rows.forEach(row => console.log(`- ${row.column_name} (${row.data_type})`));

  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

checkTables();
