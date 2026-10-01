import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTrilhaDto {
  @ApiProperty({
    example: 'Formação em Desenvolvimento Web',
    description: 'Título da trilha',
  })
  @IsString()
  @IsNotEmpty()
  Titulo!: string;

  @ApiPropertyOptional({
    example: 'Trilha de cursos para formação em desenvolvimento web',
  })
  @IsString()
  @IsOptional()
  Descricao?: string;

  @ApiProperty({
    example: 1,
    description: 'ID da categoria à qual a trilha pertence',
  })
  @IsInt()
  ID_Categoria!: number;
}
