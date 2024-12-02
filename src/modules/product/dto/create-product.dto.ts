import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @ApiProperty({ description: 'Name of shirt', example: 'Ao Thun' })
    name: string;

    @ApiPropertyOptional({ description: 'Description of shirt', example: ' Nhu 1 vi tinh tu ...' })
    description: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'price', example: 99999 })
    price: number;

    @IsNotEmpty()
    @ApiProperty({ description: 'color', example: 'white' })
    color: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'size', example: 'L' })
    size: string;
}

export class CreateProductDtoWithFiles extends CreateProductDto {
    @ApiProperty({
        description: 'Frontside image of the shirt',
        type: 'string',
        format: 'binary',
    })
    frontsideImage?: any;

    @ApiProperty({
        description: 'Backside image of the shirt',
        type: 'string',
        format: 'binary',
    })
    backsideImage?: any;
}
