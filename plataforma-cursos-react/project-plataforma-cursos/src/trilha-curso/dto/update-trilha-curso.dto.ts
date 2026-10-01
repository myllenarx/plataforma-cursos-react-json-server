import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateTrilhaCursoDto {
  @ApiPropertyOptional({
    example: 2,
    description: 'Nova ordem do curso dentro da trilha',
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  Ordem?: number;
}
