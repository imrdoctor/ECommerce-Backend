import {Module,Global} from '@nestjs/common'
import { UserModel } from './DB/model';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './common/security/Jwt';
import { UserRepositoryService } from './DB/Repository';


@Global()
@Module({
  imports: [UserModel],
  providers: [UserRepositoryService,TokenService , JwtService],
    exports: [UserRepositoryService,TokenService , JwtService,UserModel],
})
export class GlobalModule {}