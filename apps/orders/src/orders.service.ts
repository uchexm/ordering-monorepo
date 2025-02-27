import { Inject, Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrderRequest } from './dto/create-order-request';
import { BILLING_SERVICE } from './constants/services';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) {}

  async createOrder(request: CreateOrderRequest, authentication: string) {
    const session = await this.ordersRepository.startTransaction();
    try {
      const order = await this.ordersRepository.create(request, { session });
      await lastValueFrom(
        this.billingClient.emit('order_created', { request, Authentication: authentication }),
      );
      await session.commitTransaction();
      return order;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    }
  }

  async getOrders() {
    return this.ordersRepository.find({});
  }
  


}