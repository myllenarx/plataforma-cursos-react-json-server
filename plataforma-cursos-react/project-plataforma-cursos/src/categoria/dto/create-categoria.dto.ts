import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoriaDto {
  @ApiProperty({
    example: 'Programação',
    description: 'Nome da categoria',
  })
  @IsString()
  @IsNotEmpty()
  Nome!: string;

  @ApiPropertyOptional({
    example: 'Cursos relacionados ao desenvolvimento de software',
    description: 'Descrição da categoria',
  })
  @IsString()
  @IsOptional()
  Descricao?: string;
}
