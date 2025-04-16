import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
  } from 'class-validator';
  
  @ValidatorConstraint({ async: false })
  export class IsMatchConstraint implements ValidatorConstraintInterface {
    validate<T>(value: T, args: ValidationArguments): boolean {
      const [relatedPropertyName] = args.constraints;
      const object = args.object as Record<string, unknown>;
      const relatedValue = object[relatedPropertyName] as T;
      return value === relatedValue;
    }
  
    defaultMessage(args: ValidationArguments): string {
      return `${args.property} does not match ${args.constraints[0]}`;
    }
  }
  
  export function IsMatchDecorator(
    property: string,
    validationOptions?: ValidationOptions,
  ) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [property],
        validator: IsMatchConstraint,
      });
    };
  }
  