import { IsEnum, IsNotEmpty } from "class-validator";
import { ShippingStatus } from "../models/shipping-status.enum";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateShippingDto {
    @IsNotEmpty()
    @IsEnum(ShippingStatus, { message: `Status must be one of: ${Object.values(ShippingStatus).join(', ')}` })
    @ApiProperty({
        description: 'Status of shipping',
        enum: ShippingStatus,
        example: ShippingStatus.IN_TRANSIT,
    })
    status: ShippingStatus;
}
