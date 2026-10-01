import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional } from 'class-validator';

export class CreateMatriculaDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  ID_Usuario!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  ID_Curso!: number;

  @ApiPropertyOptional({
    example: '2026-09-28T20:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  DataConclusao?: string;
}
