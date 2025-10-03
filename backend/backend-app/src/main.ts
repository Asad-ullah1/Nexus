import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enhanced CORS for development and production
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://your-frontend-domain.vercel.app', // Add your frontend URL
      'https://nexus-database-8wgh.onrender.com',
    ],
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Nexus Backend is running on port ${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();
