import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {config } from 'dotenv'
import {resolve} from 'path'
import { Decrypt } from './common/security/crypto.helper';
config({path:resolve("./config/.env")})
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);

  
}
bootstrap();