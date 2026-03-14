import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './setup';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Initialize all global configurations from setup.ts
  setupApp(app);

  // await app.listen(process.env.PORT ?? 5002);


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // This strips properties that are not in the DTO
      forbidNonWhitelisted: true,
      transform: true, // Important: this helps transform plain objects to DTO classes
    }),
  );

  const port = process.env.PORT ?? 5001;
  await app.listen(port);

  console.log(`\n🚀 Server is running on: http://localhost:${port}`);
  console.log(`📝 Swagger Docs: http://localhost:${port}/api\n`);
}

bootstrap();
