import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateBlueprintDto {
    @IsNotEmpty()
    @ApiProperty({ description: 'Name of blueprint', example: 'Chill Guy' })
    name: string;

    @ApiPropertyOptional({ description: 'Description of blueprint', example: 'My life is tough, but I\'m just a chill guy' })
    description: string;
}

export class CreateBlueprintDtoWithFile extends CreateBlueprintDto {
    @ApiProperty({
        description: 'Image file for the blueprint',
        type: 'string',
        format: 'binary',
      })
    file: any;
}
