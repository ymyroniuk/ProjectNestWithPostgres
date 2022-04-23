import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from './pipes/validation-pipe';

async function bootstrap() {
  const PORT = process.env.PORT || 3000
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Приложение на NestJs')
    .setDescription('Documentation REST API')
    .setVersion('1.0.0')
    .addTag('Myronuik')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/api/docs', app, document)

  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(PORT, () => console.log(`Server has been started at ${PORT}`));
}
bootstrap();
