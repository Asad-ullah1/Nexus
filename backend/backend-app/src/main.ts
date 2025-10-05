import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Safe and flexible CORS configuration
  app.enableCors({
    origin: [
      'http://localhost:5173', // ✅ your Vite frontend (default)
      'http://localhost:5174', // if Vite picks 5174 instead of 5173
      'https://nexus-frontend.vercel.app', // 🔹 (use your actual Vercel domain after deploy)
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}`);
}
bootstrap();
