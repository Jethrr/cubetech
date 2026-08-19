import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List available products' })
  @ApiResponse({ status: 200, description: 'Available products returned.' })
  findAvailable() {
    return this.productsService.findAvailable();
  }
}
