import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateUserDto {
    @ApiPropertyOptional({ description: 'Name of user', example: 'Pham Xuan Loi' })
    name?: string;

    @ApiPropertyOptional({ description: 'password', example: 'pxloi123' })
    password?: string;
    
    @ApiPropertyOptional({ description: 'Phone number of user', example: '0912643823' })
    phoneNumber?: string;
}