import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PerfilUsuario } from '../../generated/prisma/enums';
import { ROLES_KEY } from './roles.decorator';

type UsuarioAutenticado = {
    usuarioId: number;
    email: string;
    perfil: PerfilUsuario;
};

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const rolesPermitidas = this.reflector.getAllAndOverride<PerfilUsuario[]>(
            ROLES_KEY,
            [
                context.getHandler(),
                context.getClass(),
            ],
        );

        // Se o endpoint não declarou @Roles(), não há
        // restrição adicional de perfil.
        if (!rolesPermitidas || rolesPermitidas.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest<{
            user?: UsuarioAutenticado;
        }>();

        const usuario = request.user;

        if (!usuario) {
            return false;
        }

        return rolesPermitidas.includes(usuario.perfil);
    }
}