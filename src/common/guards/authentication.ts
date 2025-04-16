import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../security/Jwt';
import { UserRepositoryService } from 'src/DB/Repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private TokenService: TokenService,
    private readonly UserRepositoryService: UserRepositoryService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();

    const [type, token] = request.headers.authorization?.split(' ') || [];
    if (!token && !type) {
      throw new ForbiddenException('Forbidden resource');
    }
    try {
      const payload = await this.TokenService.verifyToken(token, {
        secret:
          type == 'Bearer'
            ? process.env.JWT_SECRET_USER
            : type == 'Admin'
              ? process.env.JWT_SECRET_ADMIN
              : ' ',
      });
      const user = await this.UserRepositoryService.findById(payload.id);
      if(!user){
        throw new ForbiddenException('Forbidden resource');
      }
      if (user?.AccessJWTscret !== payload.AccessJWTscret) {
        throw new ForbiddenException('Forbidden resource');
      }
      request['user'] = user;      
    } catch (error) {
        throw new ForbiddenException('Forbidden resource');
    }
    return true;
  }
}