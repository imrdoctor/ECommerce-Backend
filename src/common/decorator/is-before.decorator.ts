import {ValidationArguments,ValidatorConstraint,ValidatorConstraintInterface,} from 'class-validator';
@ValidatorConstraint({ async: false })
@ValidatorConstraint({ async: false })
export class IsFutureDateConstraint implements ValidatorConstraintInterface {
  validate(date: any, args: ValidationArguments): boolean {
    const inputDate = stripTime(new Date(date));
    const today = stripTime(new Date());
    return inputDate >= today;
  }
  defaultMessage(): string {
    return 'FromDate must be today or a future date.';
  }
}

function stripTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
@ValidatorConstraint({ async: false })
export class IsAfterFromDateConstraint implements ValidatorConstraintInterface {
  validate(toDate: any, args: ValidationArguments): boolean {
    const fromDate = (args.object as any).FromDate;
    return new Date(toDate) > new Date(fromDate);
  }

  defaultMessage(): string {
    return 'ToDate must be after FromDate';
  }
}
//   FromDate
// ToDate