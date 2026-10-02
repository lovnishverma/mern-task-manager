import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure global API prefix so routes are mounted under /api (e.g. /api/tasks)
  app.setGlobalPrefix('api');

  // Enforce validation globally across all incoming request payloads
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configure CORS for local development and deployed frontend
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT || 5000;
  await app.listen(port, '0.0.0.0');
  console.log(`NestJS server running on port ${port} with prefix /api`);
}

bootstrap();
