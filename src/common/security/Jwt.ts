import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {} 
  generateToken(payload: any, options?: JwtSignOptions): string {
    return this.jwtService.sign(payload, options);
  }

  verifyToken(token: string, options?: JwtVerifyOptions): any { 
    return this.jwtService.verify(token, options);
  }
}
