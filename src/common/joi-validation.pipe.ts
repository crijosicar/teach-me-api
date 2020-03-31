import { Schema } from '@hapi/joi';
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: Schema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    console.log('value => ', JSON.stringify(value));

    const { error } = this.schema.validate(value);

    if (error) {
      // tslint:disable-next-line: no-console
      console.log('Validation failed => ', error);
      throw new BadRequestException('Validation failed');
    }

    return value;
  }
}
