import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderRequest } from './dto/create-order-request';
import { JwtAuthGuard } from '@app/common';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

 @Post()
 @UseGuards(JwtAuthGuard)
  async createOrder(@Body() request: CreateOrderRequest, @Req() req: any) {
    console.log(req.user);
    return this.ordersService.createOrder(request);

  }

  @Get()
  async getOrders() {
    return this.ordersService.getOrders();
  }
  
}
