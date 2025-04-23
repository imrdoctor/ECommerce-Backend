import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoles } from '../types/types';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class CartAccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {        
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req || context.switchToHttp().getRequest();
    const user = request.user;
    if (user.cartLocked === true) {        
        throw new ForbiddenException('You cannot modify the cart right now. Please complete or cancel your checkout.');
    }
    return true
  }
}