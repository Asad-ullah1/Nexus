import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Updated CORS Configuration
  app.enableCors({
    origin: [
      'http://localhost:5173', // local Vite dev
      'http://localhost:5174',
      'https://nexus-frontend.vercel.app', // old (if used)
      'https://nexus-m766.vercel.app', // ✅ your actual live frontend domain
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
