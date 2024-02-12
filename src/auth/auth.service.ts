import { Injectable, Body, NotFoundException } from '@nestjs/common';
import { DTO } from './auth.dto';

@Injectable()
export class AuthService {
  postRequest(@Body() dto: DTO): object {
    if (
      Object.keys(dto)[0] == undefined ||
      Object.keys(dto)[0] == '' ||
      Object.values(dto)[0] == ''
    ) {
      throw new NotFoundException('Request is not complete.');
    }
    return { response: 'success', data: dto };
  }
}
