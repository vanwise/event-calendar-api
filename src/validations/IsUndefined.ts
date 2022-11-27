import { ValidateIf } from 'class-validator';

/**
 * Ignores the other validators on a property when the value is undefined.
 */

export function IsUndefined() {
  return ValidateIf((_, value) => value !== undefined);
}
