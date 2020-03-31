import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class CheckIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    // tslint:disable-next-line: no-console
    console.log('Request...');
    next();
  }
}
