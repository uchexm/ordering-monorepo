import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './apps/orders/.env',
      isGlobal: true,
      validationSchema: Joi.object({
        // PORT: Joi.number().default(3000),
        MONGODB_URI: Joi.string().required(),
    }),
  })
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
