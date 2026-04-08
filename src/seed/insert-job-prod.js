require('dotenv').config();
const { Client } = require('pg');

const job = {
  id: '69d61e2c-4862-5120-5c05cceb'.replace(/-/g, ''),
};

// Provided job object
const JOB = {
  id: '69d61e2c-4862-5120-5c05cceb',
  title: 'MERN Developer',
  slug: 'mern-developer',
  department: 'Engineering',
  location: 'Onsite',
  type: 'Full-time',
  experience: '0-1',
  description: 'This is mern stack developer job',
  responsibilities: ['Develop Frontend and backend'],
  requirements: ['MERN Stack'],
  applicationStartDate: '2026-04-01T00:00:00.000Z',
  applicationEndDate: '2026-12-31T23:59:59.000Z',
  isActive: true,
  createdAt: '2026-04-08T09:21:48.750Z',
  updatedAt: '2026-04-08T10:29:47.431Z'
};

(async function(){
  try{
    const dbUrl = process.env.DATABASE_URL_PROD || process.env.DATABASE_URL_STAGING || process.env.DATABASE_URL;
    if(!dbUrl) throw new Error('DATABASE_URL not set in .env');
    const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
    await client.connect();

    const text = `INSERT INTO jobs(id, title, slug, department, location, type, experience, description, responsibilities, requirements, "applicationStartDate", "applicationEndDate", "isActive", "createdAt", "updatedAt") VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, slug=EXCLUDED.slug, department=EXCLUDED.department, location=EXCLUDED.location, type=EXCLUDED.type, experience=EXCLUDED.experience, description=EXCLUDED.description, responsibilities=EXCLUDED.responsibilities, requirements=EXCLUDED.requirements, "applicationStartDate"=EXCLUDED."applicationStartDate", "applicationEndDate"=EXCLUDED."applicationEndDate", "isActive"=EXCLUDED."isActive", "updatedAt"=EXCLUDED."updatedAt";`;

    const values = [
      JOB.id,
      JOB.title,
      JOB.slug,
      JOB.department,
      JOB.location,
      JOB.type,
      JOB.experience,
      JOB.description,
      JSON.stringify(JOB.responsibilities),
      JSON.stringify(JOB.requirements),
      JOB.applicationStartDate,
      JOB.applicationEndDate,
      JOB.isActive,
      JOB.createdAt,
      JOB.updatedAt,
    ];

    await client.query(text, values);
    console.log('Inserted/updated job', JOB.id);
    await client.end();
  }catch(err){
    console.error('error', err.message || err);
    process.exit(1);
  }
})();
