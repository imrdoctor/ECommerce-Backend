import { SetMetadata, UseGuards , applyDecorators } from "@nestjs/common";
import { RolesGuard } from "../guards/authorization";
import { AuthGuard } from "../guards/authentication";
import { UserRoles } from "../types/types";
import { CartAccessGuard } from "../guards/cartGuards";
import { ApiBearerAuth } from "@nestjs/swagger";

export function Auth(...roles: UserRoles[]) {
    return applyDecorators(
      ApiBearerAuth(),
        SetMetadata("roles", roles),
        UseGuards(AuthGuard, RolesGuard)
    )
}
export function CartAuth() {
    return applyDecorators(
      ApiBearerAuth(),
      SetMetadata("cartLocked", true),
      UseGuards(CartAccessGuard)
    );
  }