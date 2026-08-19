import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create an order' })
  @ApiResponse({ status: 201, description: 'Order created.' })
  @ApiResponse({ status: 400, description: 'Invalid or unavailable product.' })
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all orders (admin)' })
  @ApiResponse({ status: 200, description: 'Orders returned.' })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order detail with items' })
  @ApiResponse({ status: 200, description: 'Order returned.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({ status: 200, description: 'Order status updated.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto);
  }
}
