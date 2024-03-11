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
      const checkProfileEntry = await this.profileRepository.findOne({
        where: { username: dto.username },
      });
      if (checkProfileEntry) {
        return { error: 'profile exists' };
      }
      const date = new Date();
      this.profileRepository.save({
        auth_id: authEntry.id,
        username: dto.username,
        dateCreated: date.getTime().toString(),
        balanceUSD: '0',
      });
      return { success: 'profile created' };
    }
    return { error: 'failed to create a profile' };
  }
  async topBalance(@Body() dto: { username: string; balanceUSD: string }) {
    const user = await this.profileRepository.findOne({
      where: { username: dto.username },
    });
    const totalBalance = Number(user.balanceUSD || 0) + Number(dto.balanceUSD);
    if (user) {
      await this.profileRepository.update(
        { auth_id: user.auth_id },
        {
          balanceUSD: totalBalance.toFixed(2),
        },
      );
      return { success: `you added to your balance: ${dto.balanceUSD} USD` };
    }
    return { failed: 'failed to fill balance' };
  }
}
