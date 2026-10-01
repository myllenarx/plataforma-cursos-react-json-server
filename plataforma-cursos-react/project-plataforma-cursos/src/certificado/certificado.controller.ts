import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CertificadoService } from './certificado.service';
import { CreateCertificadoDto } from './dto/create-certificado.dto';
import { UpdateCertificadoDto } from './dto/update-certificado.dto';

@ApiTags('certificados')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('certificados')
export class CertificadoController {
  constructor(private readonly certificadoService: CertificadoService) {}

  @Post()
  @ApiOperation({ summary: 'Emitir um novo certificado' })
  create(@Body() createCertificadoDto: CreateCertificadoDto) {
    return this.certificadoService.create(createCertificadoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os certificados' })
  findAll() {
    return this.certificadoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um certificado pelo ID' })
  findOne(@Param('id') id: string) {
    return this.certificadoService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um certificado' })
  update(
    @Param('id') id: string,
    @Body() updateCertificadoDto: UpdateCertificadoDto,
  ) {
    return this.certificadoService.update(+id, updateCertificadoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um certificado' })
  remove(@Param('id') id: string) {
    return this.certificadoService.remove(+id);
  }
}
