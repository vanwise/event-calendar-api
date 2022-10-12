import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsNotEmptyString(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isNotEmptyString',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string' || (value && !value.trim().length)) {
            return false;
          }
          return true;
        },
        defaultMessage(validationArguments) {
          if (typeof validationArguments?.value !== 'string') {
            return `${validationArguments?.property} must be a string`;
          }
          return `${validationArguments?.property} cannot contain only spaces`;
        },
      },
    });
  };
}
