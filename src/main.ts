import {NestFactory, Reflector} from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ValidationPipe} from "./pipes/validation.pipe";
import * as cookieParser from "cookie-parser"
import * as fs from "fs";

import {ExpressAdapter} from "@nestjs/platform-express";
import * as https from "https";
import {ExtendedSocketIoAdapter} from "./ExtendedSocketIoAdapter";
import {AbstractWsAdapter} from "@nestjs/websockets";
var express = require('express');


async function bootstrap() {
  const PORT = process.env.PORT || 5000
 /* const httpsOptions = {
    key: fs.readFileSync('./secrets/key-rsa.pem'),
    cert: fs.readFileSync('./secrets/cert.pem'),
  };*/

  const server = express();
  const app = await NestFactory.create(AppModule, /*{
    httpsOptions: httpsOptions,
  }*/);

  //const wssServer = https.createServer(httpsOptions);
  //app.useWebSocketAdapter(new ExtendedSocketIoAdapter(wssServer));

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

  await app.init();

  app.listen(PORT, ()=>{console.log(`Server started on port = ${PORT}`)});
 // wssServer.listen(3003, ()=>{console.log(`WS Server started on port = 3003`)})


}
bootstrap();
