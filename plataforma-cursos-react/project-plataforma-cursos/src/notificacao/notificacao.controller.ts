
import {
    Controller,
    Get,
    Patch,
    Param,
    ParseIntPipe,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { NotificacaoService } from './notificacao.service';

interface RequisicaoAutenticada {
    user: {
        usuarioId: number;
        email: string;
        perfil: string;
    };
}

@ApiTags('notificacoes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('notificacoes')
export class NotificacaoController {
    constructor(
        private readonly notificacaoService: NotificacaoService,
    ) { }

    @Get()
    @ApiOperation({
        summary: 'Listar notificações do usuário autenticado',
    })
    listar(@Req() req: RequisicaoAutenticada) {
        return this.notificacaoService.listarPorUsuario(
            req.user.usuarioId,
        );
    }

    @Patch(':id/lida')
    @ApiOperation({
        summary: 'Marcar uma notificação como lida',
    })
    marcarComoLida(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: RequisicaoAutenticada,
    ) {
        return this.notificacaoService.marcarComoLida(
            id,
            req.user.usuarioId,
        );
    }
}
