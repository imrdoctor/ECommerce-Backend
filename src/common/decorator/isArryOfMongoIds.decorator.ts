import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
  } from 'class-validator';
  import { Types } from 'mongoose';
  
  @ValidatorConstraint({ name: 'IsArrayOfMongoIds', async: false })
  export class IsArrayOfMongoIdsConstraint implements ValidatorConstraintInterface {
    validate(value: any, _args: ValidationArguments): boolean {
      return Array.isArray(value) && value.every(id => Types.ObjectId.isValid(id));
    }
  
    defaultMessage(_args: ValidationArguments): string {
      return 'Each value in the array must be a valid MongoId';
    }
  }
  
  export function IsArrayOfMongoIds(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: IsArrayOfMongoIdsConstraint,
      });
    };
  }
  