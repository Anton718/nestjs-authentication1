import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo(): string {
    return 'This is a nest-js app at https://github.com/Anton718/nestjs-authentication1';
  }
}
