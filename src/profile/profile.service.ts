import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { profileDTO } from './profile.dto';
import { AuthEntity } from 'src/auth/entities/auth.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(AuthEntity)
    private authRepository: Repository<AuthEntity>,
  ) {}
  async createProfile(@Body() dto: profileDTO) {
    const authEntry = await this.authRepository.findOne({
      where: { username: dto.username },
    });
    if (authEntry) {
      this.profileRepository.save({
        auth_id: authEntry.id,
        username: dto.username,
        info: dto.info,
      });
      return { response: 'profile created' };
    }
    return { response: 'failed to create a profile' };
  }
}
