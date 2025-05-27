import { JwtService } from '@nestjs/jwt';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './Role.enum';
import { ROLES_KEY } from './Roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    let role;

    try {
      const decodedJwt = this.jwtService.decode(req.signedCookies.access_token);
      role = decodedJwt?.role;
      if (role) {
        role = 1;
      } else {
        role = 0;
      }
    } catch (error) {}

    if (!role) {
      return false;
    }
    return requiredRoles.some((requiredRole) => role === requiredRole);
  }
}
