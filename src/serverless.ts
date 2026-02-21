import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './setup';

let appPromise: Promise<any>;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupApp(app);
  await app.init();
  return app.getHttpAdapter().getInstance();
}

export default async (req, res) => {
  if (!appPromise) {
    appPromise = bootstrap();
  }
  const handler = await appPromise;
  handler(req, res);
};
