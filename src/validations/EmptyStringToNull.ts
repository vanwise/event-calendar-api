import { Transform } from 'class-transformer';

/**
 * Transforming to null if value is empty string.
 * @returns null or incoming value
 */

export function EmptyStringToNull() {
  return Transform(({ value }) =>
    typeof value === 'string' && !value ? null : value,
  );
}
