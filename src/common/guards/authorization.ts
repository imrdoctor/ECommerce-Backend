
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoles } from '../types/types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {        
    const requiredRoles = this.reflector.get<UserRoles[]>("roles" , context.getHandler());
    // const requiredRoles = this.reflector.get<UserRoles[]>("roles" , context.getClass()); -- this will not work because the roles are set on the method level not on the class level.
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();    
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
