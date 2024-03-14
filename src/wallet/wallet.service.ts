import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletEntity } from './entities/wallet.entity';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { ProfileEntity } from 'src/profile/entities/profile.entity';
import { walletDTO } from './wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletEntity)
    private walletRepository: Repository<WalletEntity>,
    @InjectRepository(AuthEntity)
    private authRepository: Repository<AuthEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
  ) {}
  async createWallet(dto: walletDTO) {
    const authIdNumber = await this.profileRepository.findOne({
      where: { auth_id: dto.auth_id },
    });
    const pass = await this.authRepository.findOne({
      where: { password: dto.password },
    });
    if (
      authIdNumber.auth_id === Number(dto.auth_id) &&
      pass.password === dto.password
    ) {
      const acc_number = Math.floor(Math.random() * 1e16);
      await this.walletRepository.save({
        auth_id: dto.auth_id,
        account: acc_number.toString(),
        balanceBTC: '0',
        balanceETH: '0',
        balanceUSDT: '0',
        balanceBNB: '0',
        balanceSOL: '0',
        balanceXRP: '0',
        balanceUSDC: '0',
        balanceADA: '0',
        balanceAVAX: '0',
        balanceDOGE: '0',
        balanceTRX: '0',
        balanceLINK: '0',
      });
      return { success: 'wallet created' };
    }
    return { failed: 'failed to create wallet' };
  }
  async getWalletInfo(id: number) {
    const user = await this.authRepository.findOne({
      where: { id: id },
    });
    if (user) {
      const data = await this.walletRepository.find({ where: { auth_id: id } });
      if (data) {
        let acc = {};
        const wallets = [];
        for (const i of data) {
          for (const j of Object.keys(i)) {
            if (j !== 'id' && j !== 'auth_id' && i[j] !== 0) {
              acc[j] = i[j];
            }
          }
          wallets.push(acc);
          acc = {};
        }
        console.log(wallets);
        return wallets;
      }
    }
    return { result: 'user does not exist' };
  }
}
