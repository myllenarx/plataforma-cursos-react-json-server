import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCertificadoDto {
  @ApiProperty({
    example: 1,
    description: 'ID do usuário que receberá o certificado',
  })
  @IsInt()
  ID_Usuario!: number;

  @ApiProperty({
    example: 1,
    description: 'ID do curso concluído',
  })
  @IsInt()
  ID_Curso!: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID da trilha concluída, quando houver',
  })
  @IsInt()
  @IsOptional()
  ID_Trilha?: number;

  @ApiProperty({
    example: 'CERT-2026-ABC123',
    description: 'Código único de verificação do certificado',
  })
  @IsString()
  @IsNotEmpty()
  CodigoVerificacao!: string;
}
