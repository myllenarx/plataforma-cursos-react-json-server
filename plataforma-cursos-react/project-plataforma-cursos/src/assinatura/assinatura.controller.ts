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

import { AssinaturaService } from './assinatura.service';
import { CreateAssinaturaDto } from './dto/create-assinatura.dto';
import { UpdateAssinaturaDto } from './dto/update-assinatura.dto';

@ApiTags('assinaturas')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('assinaturas')
export class AssinaturaController {
  constructor(private readonly assinaturaService: AssinaturaService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova assinatura' })
  create(@Body() createAssinaturaDto: CreateAssinaturaDto) {
    return this.assinaturaService.create(createAssinaturaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as assinaturas' })
  findAll() {
    return this.assinaturaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma assinatura pelo ID' })
  findOne(@Param('id') id: string) {
    return this.assinaturaService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma assinatura' })
  update(
    @Param('id') id: string,
    @Body() updateAssinaturaDto: UpdateAssinaturaDto,
  ) {
    return this.assinaturaService.update(+id, updateAssinaturaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma assinatura' })
  remove(@Param('id') id: string) {
    return this.assinaturaService.remove(+id);
  }
}
