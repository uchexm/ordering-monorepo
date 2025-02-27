import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule } from '@app/common';
import { OrdersRepository } from './orders.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './apps/orders/.env',
      isGlobal: true,
      validationSchema: Joi.object({
        // PORT: Joi.number().default(3000),
        MONGODB_URI: Joi.string().required(),
    }),
  }),
  DatabaseModule,
  MongooseModule.forFeature([{
    name: Order.name,
    schema: OrderSchema,
    // collection: 'orders',
  }])
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
