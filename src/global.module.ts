import {Module,Global} from '@nestjs/common'
import { UserModel } from './DB/model';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './common/security/Jwt';
import { UserRepositoryService } from './DB/Repository';
import { CloudinaryServece } from './common/cloudinary/cloudinary.servece';


@Global()
@Module({
  imports: [UserModel],
  providers: [UserRepositoryService,TokenService , JwtService , CloudinaryServece],
    exports: [UserRepositoryService,TokenService , JwtService,UserModel,CloudinaryServece],
})
export class GlobalModule {}