import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { PerfilUsuario } from '../../generated/prisma/enums'; export class CreateUsuarioDto {
  @ApiProperty({
    example: 'joao@email.com',
    description: 'O email do usuário',
  })
  @IsEmail()
  email!: string;
  @ApiProperty({ example: 'João Silva', description: 'Nome completo' })
  @IsString()
  @IsNotEmpty()
  name!: string;
  @ApiProperty({
    example: 'senha123',
    description: 'Senha com no mínimo 6 caracteres',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password!: string;
  @ApiProperty({
    enum: PerfilUsuario,
    example: PerfilUsuario.ALUNO,
    description: 'Perfil de acesso do usuário',
  })
  perfil?: PerfilUsuario;
}
