// import {
//   Body,
//   Controller,
//   Get,
//   HttpCode,
//   Post,
//   Req,
//   Res,
//   UsePipes,
//   ValidationPipe,
// } from '@nestjs/common';
// import { UserService } from './user.service';
// import { Response } from 'express';
// import { ZodValidationPipe } from 'src/common/pipes/customePipe';
// import { userValidation, userValidationDto } from './user.validation';

// @Controller('api/v1/users')
// // @UsePipes(new ZodValidationPipe(userValidation))
// export class UserController {
//   constructor(private readonly _userService: UserService) {}
//   @Post('signup')
//   @UsePipes(new ZodValidationPipe(userValidation))
//   getAllUsers(
//     @Req() req,
//     @Body() body: userValidationDto,
//     @Res() res: Response,
//   ): Object {
//     return this._userService.getAllUsers(req, res);
//   }
// }
