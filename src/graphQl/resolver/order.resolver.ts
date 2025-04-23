import { Query, Resolver } from "@nestjs/graphql";
import { OrderService } from "src/modules/order/order.service";
import { OrderType } from "./types/order.types";
import { UserRoles } from "src/common/types/types";
import { Auth } from "src/common/decorator/auth";

@Resolver()
export class OrderResolver{
    constructor(
        private readonly orderService:OrderService
    ){}
    @Query(()=>[OrderType],{name:'listOrders', description:'listOrders'})
    @Auth(...Object.values(UserRoles))
   async listOrders(){
        return await this.orderService.getAllOrdersGraphQl()
    }
}