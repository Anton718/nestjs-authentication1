import { Injectable, Body, NotFoundException } from '@nestjs/common';
import { DTO, updateDTO } from './auth.dto';
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
      await this.authRepository.findOne({
        where: { username: dto.username },
      })
    ) {
      return { response: 'auth exists' };
    }
    if (dto.username == undefined || dto.username == '' || dto.password == '') {
      throw new NotFoundException('Request is not complete.');
    }
    this.authRepository.save({
      username: dto.username,
      password: dto.password,
    });
    return { response: 'new auth saved' };
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
