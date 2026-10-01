import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { StatusProgresso } from '../../generated/prisma/enums';

export class CreateProgressoAulaDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  ID_Usuario!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  ID_Aula!: number;

  @ApiPropertyOptional({
    example: '2026-09-28T20:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  DataConclusao?: string;

  @ApiProperty({
    enum: StatusProgresso,
    example: StatusProgresso.CONCLUIDO,
  })
  @IsEnum(StatusProgresso)
  Status!: StatusProgresso;
}
