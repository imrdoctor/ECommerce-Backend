import { SetMetadata, UseGuards , applyDecorators } from "@nestjs/common";
import { RolesGuard } from "../guards/authorization";
import { AuthGuard } from "../guards/authentication";
import { UserRoles } from "../types/types";

export function Auth(...roles: UserRoles[]) {
    return applyDecorators(
        SetMetadata("roles", roles),
        UseGuards(AuthGuard, RolesGuard)
    )
}