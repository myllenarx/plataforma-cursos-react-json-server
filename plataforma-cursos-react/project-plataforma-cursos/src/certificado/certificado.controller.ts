import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CertificadoService } from './certificado.service';
import { CreateCertificadoDto } from './dto/create-certificado.dto';
import { UpdateCertificadoDto } from './dto/update-certificado.dto';

import { PerfilUsuario } from '../generated/prisma/enums';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';

type RequestAutenticada = {
  user: {
    usuarioId: number;
    email: string;
    perfil: PerfilUsuario;
  };
};

@ApiTags('certificados')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('certificados')
export class CertificadoController {
  constructor(private readonly certificadoService: CertificadoService) { }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ADMIN)
  @Post()
  create(@Body() dto: CreateCertificadoDto) {
    return this.certificadoService.create(dto);
  }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ALUNO, PerfilUsuario.ADMIN)
  @Get()
  findAll(@Req() req: RequestAutenticada) {
    return this.certificadoService.findAll(req.user);
  }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ALUNO, PerfilUsuario.ADMIN)
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: RequestAutenticada,
  ) {
    return this.certificadoService.findOne(+id, req.user);
  }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCertificadoDto) {
    return this.certificadoService.update(+id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.certificadoService.remove(+id);
  }
}