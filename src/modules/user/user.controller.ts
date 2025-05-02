import {Body,Controller,Get,Headers,Post,Req,Res,SetMetadata,UploadedFile,UseGuards,UsePipes,ValidationPipe,} from '@nestjs/common';
import { Response } from 'express';
import { ConfirmEmail, CustomUserLogin, CustomUserRegister, sendConfirmregisterEmail } from './dto/customUser.dto';
import { UserService } from './user.service';
import { AuthGuard } from 'src/common/guards/authentication';
import { UserRoles } from 'src/common/types/types';
import { Auth } from 'src/common/decorator/auth';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('api/v1/user')
export class UserController {   
  constructor(private readonly _userService: UserService) {}
  @Post('register/verify-email')
  @ApiOperation({ summary: 'Send Email Confarmtion For Register' })
  @ApiBody({ type: sendConfirmregisterEmail })
  @ApiResponse({
    status: 200,
    description: 'Email Send Successfully',
    type: sendConfirmregisterEmail,
  })
  @UsePipes(new ValidationPipe({
    whitelist: true,
  }))
  sendConfirmregisterEmail(
    @Body() body: sendConfirmregisterEmail, 
    @Res() res: Response,
  ){
    return this._userService.sendConfirmregister(body,res);
  }
  @Post('register')
  @UsePipes(new ValidationPipe({
    whitelist: true,
  }))
  Signup(
    @Body() body: CustomUserRegister,
    @Res() res: Response,
  ): Object {
    return this._userService.Register(res,body);
  }  
  @Post('login')
  @UsePipes(new ValidationPipe({
    whitelist: true,
  }))
  //////////////////// Create categorie ////////////////////
  Login(
    @Req() req,
    @Body() body: CustomUserLogin,
    @Res() res: Response,
  ): Object {
    return this._userService.Login(res, body);
  }
  @Auth(...Object.values(UserRoles))
  @Get('profile')
  @UsePipes(new ValidationPipe({
    whitelist: true,
  }))
  Profile(
    @Req() req,
    @Res() res: Response,
  ): Object {
    return this._userService.profile(req, res);
  }
  //////////////////// Update categorie ////////////////////
  // @UseGuards(AuthGuard)
  // @Post('confirm')
  // @UsePipes(new ValidationPipe({
  //   whitelist: true, // - to remove any properties that are not in the DTO
  //   // forbidNonWhitelisted: true, // - to throw an error if any properties are not in the DTO
  //   // transform: true, // - to automatically transform the request body to the DTO class instance
  // }))
  // confirmEmail( 
  //   @Req() req,
  //   @Body() body: ConfirmEmail,
  //   @Res() res: Response,
  //   @UploadedFile() img: Express.Multer.File,
  // ):Object{    
  //   return this._userService.confirmEmail(req, res, body);
  // }
}