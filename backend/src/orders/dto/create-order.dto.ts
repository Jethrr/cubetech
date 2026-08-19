import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsString, Length, ValidateNested } from 'class-validator';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  @ApiProperty({ example: 'Juan Dela Cruz' })
  @IsString()
  @Length(2, 255)
  customerName: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
