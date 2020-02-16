import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const valueAsInteger = parseInt(value, 10);

    if (isNaN(valueAsInteger)) {
      console.log('ParseInt failed => ', valueAsInteger);
      throw new BadRequestException('ParseInt failed');
    }

    return valueAsInteger;
  }
}
