import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { OrderResolver } from "./resolver/order.resolver";
import { OrderModule } from "src/modules/order/order.module";

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: 'schema.gql',
          playground: true,
        }),
        OrderModule
      ],
      providers: [OrderResolver],
})
export class GraphQlConfigModule {}
