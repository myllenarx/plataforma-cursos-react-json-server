import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt } from 'class-validator';

export class CreateAssinaturaDto {
  @ApiProperty({
    example: 1,
    description: 'ID do usuário que realizará a assinatura',
  })
  @IsInt()
  ID_Usuario!: number;

  @ApiProperty({
    example: 1,
    description: 'ID do plano contratado',
  })
  @IsInt()
  ID_Plano!: number;

  @ApiProperty({
    example: '2026-09-28T20:00:00.000Z',
    description: 'Data de início da assinatura',
  })
  @IsDateString()
  DataInicio!: string;

  @ApiProperty({
    example: '2026-10-28T20:00:00.000Z',
    description: 'Data de término da assinatura',
  })
  @IsDateString()
  DataFim!: string;
}
