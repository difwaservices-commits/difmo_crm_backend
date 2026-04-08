import { Client } from 'pg';

async function fixJobMessagesTable() {
  const client = new Client({
    connectionString: 'postgresql://neondb_owner:npg_EnjzltFx6X2Q@ep-still-shape-a8fph0be-pooler.eastus2.azure.neon.tech/difmocrm_prod?sslmode=require'
  });

  try {
    await client.connect();
    console.log('Connected to database\n');

    // Check if table exists
    const checkTable = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'job_messages'
      );
    `);

    const tableExists = checkTable.rows[0].exists;
    console.log(`job_messages table exists: ${tableExists}\n`);

    if (!tableExists) {
      console.log('Creating job_messages table...\n');
      
      await client.query(`
        CREATE TABLE job_messages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "jobId" UUID,
          "fromEmail" VARCHAR(255) NOT NULL,
          subject VARCHAR(255) NOT NULL,
          body TEXT NOT NULL,
          read BOOLEAN DEFAULT false,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      console.log('✅ job_messages table created successfully\n');
    } else {
      console.log('✅ job_messages table already exists\n');
    }

    // Check table structure
    const columns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'job_messages'
      ORDER BY ordinal_position;
    `);

    console.log('Table structure:');
    columns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });

    console.log('\n✅ Database check/repair complete!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

fixJobMessagesTable();
