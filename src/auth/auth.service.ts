import { Injectable, Body, NotFoundException } from '@nestjs/common';
import { DTO } from './auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthEntity } from 'src/entities/auth.entity';
import { Repository } from 'typeorm';
import { updateDTO } from './updateAuth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private authRepository: Repository<AuthEntity>,
  ) {}
  async postData(@Body() dto: DTO) {
    if (
      await this.authRepository.findOne({
        where: { username: Object.keys(dto)[0] },
      })
    ) {
      return { response: 'auth exists' };
    }
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
    if (
      await this.authRepository.findOne({
        where: { id: id },
      })
    ) {
      await this.authRepository.delete(id);
      return { result: `deleted id ${id}` };
    } else {
      return { result: `id ${id} not found` };
    }
  }

  async getAllData() {
    const allData = await this.authRepository.find();
    return allData;
  }

  async updateAuth(@Body() dto: updateDTO) {
    const authInstance = await this.authRepository.findOne({
      where: { id: dto.id },
    });
    if (!authInstance) {
      return { response: 'id not found' };
    }
    if (dto.id == authInstance.id) {
      if (
        dto.username !== authInstance.username &&
        (await this.authRepository.findOne({
          where: { username: dto.username },
        }))
      ) {
        return { response: 'auth exists' };
      }
      await this.authRepository.update(dto.id, dto);
      return { response: 'success' };
    }
  }
}
