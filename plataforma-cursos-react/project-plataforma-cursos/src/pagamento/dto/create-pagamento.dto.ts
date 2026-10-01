import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { MetodoPagamento } from '../../generated/prisma/enums';

export class CreatePagamentoDto {
  @ApiProperty({
    example: 1,
    description: 'ID da assinatura relacionada ao pagamento',
  })
  @IsInt()
  ID_Assinatura!: number;

  @ApiProperty({
    example: 49.9,
    description: 'Valor pago',
  })
  @IsNumber()
  @Min(0)
  ValorPago!: number;

  @ApiProperty({
    example: '2026-09-28T20:00:00.000Z',
    description: 'Data em que o pagamento foi realizado',
  })
  @IsDateString()
  DataPagamento!: string;

  @ApiProperty({
    enum: MetodoPagamento,
    example: MetodoPagamento.PIX,
    description: 'Método utilizado no pagamento',
  })
  @IsEnum(MetodoPagamento)
  MetodoPagamento!: MetodoPagamento;

  @ApiProperty({
    example: 'TXN-2026-001',
    description: 'Identificador da transação no gateway de pagamento',
  })
  @IsString()
  @IsNotEmpty()
  Id_Transacao_Gateway!: string;
}
