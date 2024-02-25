import { Injectable, Body, NotFoundException } from '@nestjs/common';
import { DTO } from './auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthEntity } from 'src/entities/auth.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private authRepository: Repository<AuthEntity>,
  ) {}
  async postData(@Body() dto: DTO) {
    if (
      Object.keys(dto)[0] == undefined ||
      Object.keys(dto)[0] == '' ||
      Object.values(dto)[0] == ''
    ) {
      throw new NotFoundException('Request is not complete.');
    }
    await this.authRepository.save({
      username: Object.keys(dto)[0],
      password: Object.values(dto)[0],
    });
    return { response: 'success', data: dto };
  }

  async delData(id: number) {
    await this.authRepository.delete(id);
    return { response: 'done' };
  }
}
