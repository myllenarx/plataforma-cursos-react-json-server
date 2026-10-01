import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateModuloDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  ID_Curso!: number;

  @ApiProperty({ example: 'Introdução ao curso' })
  @IsString()
  @IsNotEmpty()
  Titulo!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  Ordem!: number;
}
