import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateOrderDto {
    @IsNotEmpty()
    @ApiProperty({ description: 'Order quantity', example: 2 })
    quantity: number;

    @IsNotEmpty()
    @ApiProperty({ description: 'The shipping address', example: 'Cong dai hoc UET' })
    address: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'productId', example: 1 })
    productId: number;

    @IsNotEmpty()
    @ApiProperty({ description: 'blueprintId', example: 1 })
    blueprintId: number;
}
