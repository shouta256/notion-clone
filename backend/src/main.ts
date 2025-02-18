import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const corsOptions: CorsOptions = {
		origin: "https://notion-clone-ten-delta.vercel.app", // 許可するオリジンを指定
		credentials: true,
		methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
	};
	app.enableCors(corsOptions);

	const port = process.env.PORT || 8080;
	await app.listen(port);
}
bootstrap();
