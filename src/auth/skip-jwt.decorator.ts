import { SetMetadata } from '@nestjs/common';

export const IS_SKIP_JWT_CHECK_KEY = 'isSkipJwtCheck';

export function SkipJwtCheck() {
  return SetMetadata(IS_SKIP_JWT_CHECK_KEY, true);
}
