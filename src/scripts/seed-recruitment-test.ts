import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { JobsService } from '../modules/jobs/jobs.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const jobsService = app.get(JobsService);

  console.log('🚀 Seeding recruitment test data...');

  try {
    // 1. Create a Job
    const testJob = await jobsService.createJob({
      title: 'Full Stack Developer (Recruitment Test)',
      department: 'Technology',
      location: 'Remote',
      type: 'Full-time',
      experience: '3+ years',
      description: 'This is a test job posted to verify the recruitment module workflow.',
      responsibilities: ['Build high-quality features', 'Participate in code reviews'],
      requirements: ['Proven experience with React and NestJS', 'Strong debugging skills'],
      isActive: true,
    });
    console.log(`✅ Job created successfully: ${testJob.title} (ID: ${testJob.id})`);

    // 2. Create an Application for this Job
    const testApp = await jobsService.createApplication(testJob.id, {
      fullName: 'Ramjee Test Candidate',
      email: 'ramjeetest@example.com',
      phone: '+91 9876543210',
      experience: '4 years',
      location: 'New Delhi',
      status: 'PENDING',
    });
    console.log(`✅ Application created successfully for: ${testApp.fullName} (ID: ${testApp.id})`);

    console.log('\n🌟 Test data seeding completed successfully!');
    console.log('You can now verify this in the UI at /jobs and /jobs/applications');

  } catch (error) {
    console.error('❌ Error seeding test data:', error.message);
  } finally {
    await app.close();
    process.exit(0);
  }
}

bootstrap();
