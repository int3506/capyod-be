import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from 'src/modules/auth/models/role.enum';

export class CreateUserDto {
    @IsNotEmpty()
    @ApiProperty({ description: 'Name of user', example: 'Pham Xuan Loi' })
    name: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ description: 'email', example: 'pxloi@gmail.com' })
    email: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'password', example: 'pxloi123' })
    password: string;

    @ApiPropertyOptional({ description: 'Phone number of user', example: '0912643823' })
    phoneNumber?: string;

    @IsEnum(Role, { message: `Role must be one of: ${Object.values(Role).join(', ')}` })
    @ApiProperty({
        description: 'Role of user',
        enum: Role,
        example: Role.USER,
    })
    role: Role;
}
