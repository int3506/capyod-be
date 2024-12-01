import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../models/order-status.enum';

export class UpdateOrderDto {
    @IsNotEmpty()
    @IsEnum(OrderStatus, { message: `Status must be one of: ${Object.values(OrderStatus).join(', ')}` })
    @ApiProperty({
        description: 'Status of order',
        enum: OrderStatus,
        example: OrderStatus.IN_TRANSIT,
    })
    status: OrderStatus;
}
