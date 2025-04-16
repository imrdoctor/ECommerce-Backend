import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { QueryDto } from 'src/modules/product/dto/product.dto';

export const CustomQuery = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = plainToInstance(QueryDto, request.query, {
      excludeExtraneousValues: true,
    });

    const errors = validateSync(query);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
    }

    return query;
  },
);
