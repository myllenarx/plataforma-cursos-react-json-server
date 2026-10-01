import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { NivelCurso } from '../../generated/prisma/enums';

export class CreateCursoDto {
  @ApiProperty({ example: 'Desenvolvimento Web' })
  @IsString()
  @IsNotEmpty()
  Titulo!: string;

  @ApiPropertyOptional({
    example: 'Curso completo de desenvolvimento web',
  })
  @IsString()
  @IsOptional()
  Descricao?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  ID_Instrutor!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  ID_Categoria!: number;

  @ApiProperty({
    enum: NivelCurso,
    example: NivelCurso.INICIANTE,
  })
  @IsEnum(NivelCurso)
  Nivel!: NivelCurso;

  @ApiPropertyOptional({
    example: '2026-09-28T20:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  DataPublicacao?: string;

  @ApiProperty({ example: 20 })
  @IsInt()
  @Min(0)
  TotalAulas!: number;

  @ApiProperty({ example: 10.5 })
  @IsNumber()
  @Min(0)
  TotalHoras!: number;
}
