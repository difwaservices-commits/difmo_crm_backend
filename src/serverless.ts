import { ValidationPipe } from '@nestjs/common';
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
  const origin = req.headers.origin;
  
  // CORS configuration
  const setCorsHeaders = (response, requestOrigin) => {
    const allowedOrigins = [
      'https://difmo-crm-frontend.vercel.app',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:3000'
    ];

    const isAllowed = !requestOrigin || 
      allowedOrigins.includes(requestOrigin) || 
      requestOrigin.endsWith('.vercel.app') ||
      requestOrigin.includes('localhost:') ||
      requestOrigin.includes('127.0.0.1:');

    if (isAllowed && requestOrigin) {
      response.setHeader('Access-Control-Allow-Origin', requestOrigin);
    } else {
      response.setHeader('Access-Control-Allow-Origin', 'https://difmo-crm-frontend.vercel.app');
    }

    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT,HEAD');
    response.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
    response.setHeader('X-CORS-Debug', 'Serverless-Handler-Applied');
  };

  // Always set headers at the start
  setCorsHeaders(res, origin);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (!appPromise) {
      appPromise = bootstrap();
    }
    const handler = await appPromise;
    return handler(req, res);
  } catch (error) {
    console.error('SERVERLESS_BOOTSTRAP_ERROR:', error);
    
    // Ensure headers are set even on error
    setCorsHeaders(res, origin);
    
    res.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error during bootstrap',
      error: error.message,
      path: req.url
    });
  }
};
