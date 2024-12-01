import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateOrderDto {
    @IsNotEmpty()
    @ApiProperty({ description: 'Quantity of orderItem', example: 2 })
    quantity: number;

    @IsNotEmpty()
    @ApiProperty({ description: 'The shipping address', example: 'Cong dai hoc UET' })
    address: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'orderItemId', example: 1 })
    orderItemId: number;
}
