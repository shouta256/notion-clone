import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // All routes will start with /api to match frontend baseURL
  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Centralized CORS configuration
  const allowedOrigins = [
    "https://notion-clone-ten-delta.vercel.app",
    "http://localhost:3000",
    "https://localhost:3000",
    process.env.FRONTEND_ORIGIN, // optional env override
  ].filter(Boolean) as string[];
  const isDev = process.env.NODE_ENV !== "production";

  app.enableCors({
    origin: (origin, callback) => {
      // Allow non-browser requests (e.g., curl, server-to-server) where origin is undefined
      if (!origin) {
        return callback(null, true);
      }
      if (
        allowedOrigins.includes(origin) ||
        (isDev && (origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1")))
      ) {
        return callback(null, true);
      }
      return callback(new Error(`Not allowed by CORS: ${origin}`), false);
    },
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  });

  const port = process.env.PORT || 8080;
  await app.listen(port);
}
bootstrap();
