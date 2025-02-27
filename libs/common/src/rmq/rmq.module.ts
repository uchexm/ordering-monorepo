import { DynamicModule, Module } from '@nestjs/common';
import { RmqService } from './rmq.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

interface RmqModuleOptions {
  name: string;
}

@Module({
  imports: [],
  controllers: [],
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static register({ name}: RmqModuleOptions): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync([{
          name,
          useFactory:(ConfigService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: [ConfigService.get<string>('RABBIT_MQ_URI') || 'amqp://localhost'],
              queue: ConfigService.get<string>(`RABBIT_MQ_${name}_QUEUE`),
              noAck: true,
              persistent: true,
            },
          }),
          inject: [ConfigService],

        }])
      ],
      exports: [ClientsModule]
    };
  }
}