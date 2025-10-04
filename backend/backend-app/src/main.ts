import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Updated CORS config
  app.enableCors({
    origin: [
      'http://localhost:5174', // local Vite dev frontend
      // (replace with your actual frontend domain when deployed)
      'https://nexus-database-8wgh.onrender.com', // allow self requests (Render internal health checks)
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
