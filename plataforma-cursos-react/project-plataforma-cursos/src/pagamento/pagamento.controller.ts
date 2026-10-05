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

import { PagamentoService } from './pagamento.service';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';

import { PerfilUsuario } from '../generated/prisma/enums';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';

type UsuarioAutenticado = {
  usuarioId: number;
  email: string;
  perfil: PerfilUsuario;
};

type RequestAutenticada = {
  user: UsuarioAutenticado;
};

@ApiTags('pagamentos')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('pagamentos')
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) { }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ALUNO, PerfilUsuario.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Registrar um novo pagamento' })
  create(
    @Body() createPagamentoDto: CreatePagamentoDto,
    @Req() req: RequestAutenticada,
  ) {
    return this.pagamentoService.create(createPagamentoDto, req.user);
  }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ALUNO, PerfilUsuario.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Listar pagamentos permitidos ao usuário' })
  findAll(@Req() req: RequestAutenticada) {
    return this.pagamentoService.findAll(req.user);
  }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ALUNO, PerfilUsuario.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Buscar um pagamento pelo ID' })
  findOne(
    @Param('id') id: string,
    @Req() req: RequestAutenticada,
  ) {
    return this.pagamentoService.findOne(+id, req.user);
  }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um pagamento' })
  update(
    @Param('id') id: string,
    @Body() updatePagamentoDto: UpdatePagamentoDto,
  ) {
    return this.pagamentoService.update(+id, updatePagamentoDto);
  }

  @UseGuards(RolesGuard)
  @Roles(PerfilUsuario.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover um pagamento' })
  remove(@Param('id') id: string) {
    return this.pagamentoService.remove(+id);
  }
}