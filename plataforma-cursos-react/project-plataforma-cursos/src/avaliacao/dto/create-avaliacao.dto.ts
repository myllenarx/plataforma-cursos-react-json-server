import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateAvaliacaoDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  ID_Usuario!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  ID_Curso!: number;

  @ApiProperty({
    example: 5,
    description: 'Nota atribuída ao curso',
  })
  @IsNumber()
  @Min(0)
  @Max(5)
  Nota!: number;

  @ApiPropertyOptional({
    example: 'Excelente curso!',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  Comentario?: string;
}
