import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAvailable() {
    return this.prisma.product.findMany({
      where: { isAvailable: true },
      select: {
        id: true,
        name: true,
        category: true,
        price: true,
        imageUrl: true,
      },
    });
  }
}
