import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { PAYMENTS_QUEUE } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow("RABBIT_MQ_URI")],
      queue: PAYMENTS_QUEUE
    },
  });
  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
  // await app.listen(configService.get<number>('PORT'));
}
bootstrap();
