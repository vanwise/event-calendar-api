import { Transform } from 'class-transformer';

/**
 * Trimming the value if it string.
 * @return null or incoming value
 */

export function Trim() {
  return Transform(({ value }) =>
    value && typeof value === 'string' ? value.trim() : value,
  );
}
