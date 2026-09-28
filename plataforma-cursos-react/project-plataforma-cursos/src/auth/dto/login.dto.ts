import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'joao@email.com', description: 'E-mail do usuário' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'senha123', description: 'Senha do usuário' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password!: string;
}