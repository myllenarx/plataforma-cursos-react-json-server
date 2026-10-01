import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePlanoDto {
  @ApiProperty({
    example: 'Plano Premium',
    description: 'Nome do plano',
  })
  @IsString()
  @IsNotEmpty()
  Nome!: string;

  @ApiPropertyOptional({
    example: 'Acesso completo aos cursos da plataforma',
    description: 'Descrição do plano',
  })
  @IsString()
  @IsOptional()
  Descricao?: string;

  @ApiProperty({
    example: 49.9,
    description: 'Preço do plano',
  })
  @IsNumber()
  @Min(0)
  Preco!: number;

  @ApiProperty({
    example: 1,
    description: 'Duração do plano em meses',
  })
  @IsInt()
  @Min(1)
  DuracaoMeses!: number;
}
