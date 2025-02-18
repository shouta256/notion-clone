import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: "https://notion-clone-ten-delta.vercel.app",
		methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
		credentials: true,
	});

	// カスタムミドルウェアでOPTIONSリクエストに応答（必要なら）
	app.use((req, res, next) => {
		if (req.method === "OPTIONS") {
			res.header(
				"Access-Control-Allow-Origin",
				"https://notion-clone-ten-delta.vercel.app",
			);
			res.header(
				"Access-Control-Allow-Methods",
				"GET,POST,PUT,PATCH,DELETE,OPTIONS",
			);
			res.header(
				"Access-Control-Allow-Headers",
				"Content-Type,Authorization,X-Requested-With",
			);
			return res.status(200).end();
		}
		next();
	});

	const port = process.env.PORT || 8080;
	await app.listen(port);
}
bootstrap();
