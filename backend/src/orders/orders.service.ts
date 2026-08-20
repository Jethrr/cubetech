import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    const productIds = dto.items.map((item) => item.productId);

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((product) => [product.id, product]));

    for (const item of dto.items) {
      const product = productMap.get(item.productId);
      if (!product || !product.isAvailable) {
        throw new BadRequestException(
          `Product ${item.productId} is not available or does not exist`,
        );
      }
    }

    const orderItemsData = dto.items.map((item) => {
      const product = productMap.get(item.productId)!;
      const price = product.price;
      const subtotal = price.mul(item.quantity);
      return {
        productId: product.id,
        productName: product.name,
        price,
        quantity: item.quantity,
        subtotal,
      };
    });

    const totalAmount = orderItemsData.reduce(
      (sum, item) => sum.add(item.subtotal),
      new Prisma.Decimal(0),
    );

    return this.prisma.order.create({
      data: {
        customerName: dto.customerName,
        totalAmount,
        status: OrderStatus.PENDING,
        items: { create: orderItemsData },
      },
      include: { items: true },
    });
  }

  async findAll() {
    const orders = await this.prisma.order.findMany({
      select: {
        id: true,
        customerName: true,
        totalAmount: true,
        status: true,
        createdAt: true,
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map(({ _count, ...order }) => ({
      ...order,
      itemCount: _count.items,
    }));
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    return order;
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDto) {
    await this.findOne(id);

    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
      include: { items: true },
    });
  }
}
