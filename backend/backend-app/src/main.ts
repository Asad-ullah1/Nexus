import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Safe and flexible CORS configuration
  app.enableCors({
    origin: [
      'http://localhost:5173', // for local Vite dev
      'http://localhost:5174', // optional local
      'https://nexus-m766.vercel.app', // ✅ your actual deployed frontend URL (NOT nexus-frontend.vercel.app)
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Backend running on port ${port}`);
}

bootstrap();
