import {NestFactory, Reflector} from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {JwtAuth1Guard} from "./auth1/jwt-auth1.guard";
import {ValidationPipe} from "./pipes/validation.pipe";
import {AtGuard} from "./auth/common/guards/at.guard";
import {NestExpressApplication} from "@nestjs/platform-express";
import * as cookieParser from "cookie-parser"

async function bootstrap() {
  const PORT = process.env.PORT || 5000
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: ['Content-Type', 'Authorization'],
    origin: `${process.env.CORS_HOST}`,
    credentials: true,

  })
  app.use(cookieParser())

  const config = new DocumentBuilder()
      .setTitle('API Гадание')
      .setDescription('Документация REST API')
      .setVersion('1.0.0')
      .addTag('9VAL Media')
      .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/api/docs', app, document)
  app.useGlobalPipes(new ValidationPipe())


  await app.listen(PORT, ()=>{console.log(`Server started on port = ${PORT}`)});
}
bootstrap();
