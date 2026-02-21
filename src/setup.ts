import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as yaml from 'yaml';
import * as fs from 'fs';

export function setupApp(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Difmo CRM API')
    .setDescription('The Difmo CRM API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('http://localhost:3000', 'Development')
    .addServer('https://api.difmocrm.com', 'Production')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  try {
    const yamlString = yaml.stringify(document, {});
    fs.writeFileSync('./swagger.yaml', yamlString);
  } catch (e) {
    console.warn('Could not write swagger.yaml', e);
  }

  SwaggerModule.setup('api', app, document);
  return app;
}
