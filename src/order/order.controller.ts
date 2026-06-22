import { Controller, Get, Post } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Get('getOrder')
  getOrder(): string {
    return this.orderService.getOrder();
  }
  @Post('createOrder')
  createOrder(): string {
    return 'Order created';
  }
}
