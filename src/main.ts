import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {config } from 'dotenv'
import {resolve} from 'path'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
config({path:resolve("./config/.env")})
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle('E-commerce Application')
  .setDescription('API documentation for my E-commerce application')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); 
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Swagger is running on http://localhost:${port}/api-docs`);
}
bootstrap();