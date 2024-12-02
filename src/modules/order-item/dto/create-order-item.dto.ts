import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateOrderItemDto {
    @IsNotEmpty()
    @ApiProperty({ description: 'productId', example: 1 })
    productId: number;
}

export class CreateOrderItemDtoWithFiles extends CreateOrderItemDto {
    @ApiPropertyOptional({
        description: 'Frontside image file (optional)',
        type: 'string',
        format: 'binary',
    })
    frontsideImage?: any;

    @ApiPropertyOptional({
        description: 'Backside image file (optional)',
        type: 'string',
        format: 'binary',
    })
    backsideImage?: any;
}
