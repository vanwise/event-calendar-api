import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';
import { ClassConstructor } from 'class-transformer';

export const NotMatch = <T>(
  type: ClassConstructor<T>,
  property: keyof T,
  validationOptions?: ValidationOptions,
) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'notMatch',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [propName] = args.constraints;
          return args.object[propName] !== value;
        },
        defaultMessage(args: ValidationArguments) {
          const [constraintProperty]: (keyof T)[] = args.constraints;
          return `${String(constraintProperty)} and ${
            args.property
          } must be not match`;
        },
      },
    });
  };
};
