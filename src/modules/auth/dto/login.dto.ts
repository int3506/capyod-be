import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginDto {
    @IsNotEmpty()
    @ApiProperty({ description: 'email', example: 'pxloi@gmail.com' })
    email: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'password', example: 'pxloi123' })
    password: string;
}