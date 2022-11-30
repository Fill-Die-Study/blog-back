import { HttpStatus } from '@nestjs/common';

export class CommonOutput {
  statusCode: HttpStatus;
  error?: string;
}
