import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service"
import { UserModel } from "src/DB/model/user.model";
import { UserRepositoryService } from "src/DB/Repository/user.repository";
import { otpRepositoryService } from "src/DB/Repository";
import { otpModel } from "src/DB/model";

@Module({
    controllers: [UserController],
    providers: [UserRepositoryService, UserService , otpRepositoryService ],
    imports: [UserModel , otpModel]
})
export class UserModule {}