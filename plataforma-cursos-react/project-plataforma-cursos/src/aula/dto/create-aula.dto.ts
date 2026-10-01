import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { TipoConteudo } from '../../generated/prisma/enums';

export class CreateAulaDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  ID_Modulo!: number;

  @ApiProperty({ example: 'Introdução ao HTML' })
  @IsString()
  @IsNotEmpty()
  Titulo!: string;

  @ApiProperty({
    enum: TipoConteudo,
    example: TipoConteudo.VIDEO,
  })
  @IsEnum(TipoConteudo)
  TipoConteudo!: TipoConteudo;

  @ApiPropertyOptional({
    example: 'https://exemplo.com/aulas/html',
  })
  @IsString()
  @IsUrl()
  @IsOptional()
  URL_Conteudo?: string;

  @ApiPropertyOptional({ example: 30 })
  @IsInt()
  @Min(0)
  @IsOptional()
  DuracaoMinutos?: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  Ordem!: number;
}
