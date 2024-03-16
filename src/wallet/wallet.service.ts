import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalletEntity } from './entities/wallet.entity';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { ProfileEntity } from 'src/profile/entities/profile.entity';
import { walletDTO, transactionDTO } from './wallet.dto';

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
        return wallets;
      }
    }
    return { result: 'user does not exist' };
  }

  async tradeCrypto(dto: transactionDTO) {
    const userAuth = await this.authRepository.findOne({
      where: {
        username: dto.username,
        password: dto.password,
        id: dto.auth_id,
      },
    });
    if (!userAuth) {
      return { result: 'no user' };
    }
    const userWallet = await this.walletRepository.find({
      where: { auth_id: userAuth.id },
    });
    if (!userWallet[0]) {
      return { result: 'no wallets found' };
    }
    const userBalanceUSD = await this.profileRepository.findOne({
      where: { auth_id: userAuth.id },
    });
    if (Number(userBalanceUSD.balanceUSD) === 0) {
      return { result: 'please top your balance' };
    }
    let response;
    let data;
    let currentCoinPrice;
    let destinationWallet;
    let userCurrentCryptoBalance;
    switch (dto.coin) {
      case 'BTC':
        response = await fetch(
          `https://api.coinbase.com/v2/exchange-rates?currency=${dto.coin}`,
        );
        data = await response.json();
        currentCoinPrice = Number(data.data.rates.USD);
        if (Number(userBalanceUSD.balanceUSD) < Number(dto.amountUSD)) {
          return { response: 'not enough balance for transaction' };
        }
        destinationWallet = dto.wallet;
        userCurrentCryptoBalance = await this.walletRepository.findOne({
          where: { account: destinationWallet },
        });
        if (dto.trade === 'buy') {
          const amountInTargetCoin =
            Number(userBalanceUSD.balanceUSD) / currentCoinPrice;
          const userUpdatedCryptoBalance =
            Number(userCurrentCryptoBalance.balanceBTC) + amountInTargetCoin;
          await this.walletRepository.update(userCurrentCryptoBalance.id, {
            balanceBTC: userUpdatedCryptoBalance.toString(),
          });
          const newBalanceUSD =
            Number(userBalanceUSD.balanceUSD) - Number(dto.amountUSD);
          await this.profileRepository.update(
            { auth_id: dto.auth_id },
            {
              balanceUSD: newBalanceUSD.toString(),
            },
          );
        } else if (dto.trade === 'sell') {
          if (
            !(
              Number(userCurrentCryptoBalance.balanceBTC) -
                Number(dto.amountCrypto) >
              0
            )
          ) {
            return { response: 'not enough crypto balance' };
          }
          const userUpdatedCryptoBalance =
            Number(userCurrentCryptoBalance.balanceBTC) -
            Number(dto.amountCrypto);
          const newBalanceUSD =
            Number(userBalanceUSD.balanceUSD) +
            currentCoinPrice * Number(dto.amountCrypto);
          await this.walletRepository.update(userCurrentCryptoBalance.id, {
            balanceBTC: userUpdatedCryptoBalance.toString(),
          });
          await this.profileRepository.update(
            { auth_id: dto.auth_id },
            { balanceUSD: newBalanceUSD.toString() },
          );
        }
        break;
      case 'ETH':
        response = await fetch(
          `https://api.coinbase.com/v2/exchange-rates?currency=${dto.coin}`,
        );
        data = await response.json();
        currentCoinPrice = Number(data.data.rates.USD);
        if (Number(userBalanceUSD.balanceUSD) < Number(dto.amountUSD)) {
          return { response: 'not enough balance for transaction' };
        }
        destinationWallet = dto.wallet;
        userCurrentCryptoBalance = await this.walletRepository.findOne({
          where: { account: destinationWallet },
        });
        if (dto.trade === 'buy') {
          const amountInTargetCoin =
            Number(userBalanceUSD.balanceUSD) / currentCoinPrice;
          const userUpdatedCryptoBalance =
            Number(userCurrentCryptoBalance.balanceETH) + amountInTargetCoin;
          await this.walletRepository.update(userCurrentCryptoBalance.id, {
            balanceETH: userUpdatedCryptoBalance.toString(),
          });
          const newBalanceUSD =
            Number(userBalanceUSD.balanceUSD) - Number(dto.amountUSD);
          await this.profileRepository.update(
            { auth_id: dto.auth_id },
            {
              balanceUSD: newBalanceUSD.toString(),
            },
          );
        } else if (dto.trade === 'sell') {
          if (
            !(
              Number(userCurrentCryptoBalance.balanceETH) -
                Number(dto.amountCrypto) >
              0
            )
          ) {
            return { response: 'not enough crypto balance' };
          }
          const userUpdatedCryptoBalance =
            Number(userCurrentCryptoBalance.balanceETH) -
            Number(dto.amountCrypto);
          const newBalanceUSD =
            Number(userBalanceUSD.balanceUSD) +
            currentCoinPrice * Number(dto.amountCrypto);
          await this.walletRepository.update(userCurrentCryptoBalance.id, {
            balanceETH: userUpdatedCryptoBalance.toString(),
          });
          await this.profileRepository.update(
            { auth_id: dto.auth_id },
            { balanceUSD: newBalanceUSD.toString() },
          );
        }
        break;
      case 'USDT':
        response = await fetch(
          `https://api.coinbase.com/v2/exchange-rates?currency=${dto.coin}`,
        );
        data = await response.json();
        currentCoinPrice = Number(data.data.rates.USD);
        if (Number(userBalanceUSD.balanceUSD) < Number(dto.amountUSD)) {
          return { response: 'not enough balance for transaction' };
        }
        destinationWallet = dto.wallet;
        userCurrentCryptoBalance = await this.walletRepository.findOne({
          where: { account: destinationWallet },
        });
        if (dto.trade === 'buy') {
          const amountInTargetCoin =
            Number(userBalanceUSD.balanceUSD) / currentCoinPrice;
          const userUpdatedCryptoBalance =
            Number(userCurrentCryptoBalance.balanceUSDT) + amountInTargetCoin;
          await this.walletRepository.update(userCurrentCryptoBalance.id, {
            balanceUSDT: userUpdatedCryptoBalance.toString(),
          });
          const newBalanceUSD =
            Number(userBalanceUSD.balanceUSD) - Number(dto.amountUSD);
          await this.profileRepository.update(
            { auth_id: dto.auth_id },
            {
              balanceUSD: newBalanceUSD.toString(),
            },
          );
        } else if (dto.trade === 'sell') {
          if (
            !(
              Number(userCurrentCryptoBalance.balanceUSDT) -
                Number(dto.amountCrypto) >
              0
            )
          ) {
            return { response: 'not enough crypto balance' };
          }
          const userUpdatedCryptoBalance =
            Number(userCurrentCryptoBalance.balanceUSDT) -
            Number(dto.amountCrypto);
          const newBalanceUSD =
            Number(userBalanceUSD.balanceUSD) +
            currentCoinPrice * Number(dto.amountCrypto);
          await this.walletRepository.update(userCurrentCryptoBalance.id, {
            balanceUSDT: userUpdatedCryptoBalance.toString(),
          });
          await this.profileRepository.update(
            { auth_id: dto.auth_id },
            { balanceUSD: newBalanceUSD.toString() },
          );
        }
        break;
      case 'BNB':
        response = await fetch(
          `https://api.coinbase.com/v2/exchange-rates?currency=${dto.coin}`,
        );
        data = await response.json();
        currentCoinPrice = Number(data.data.rates.USD);
        if (Number(userBalanceUSD.balanceUSD) < Number(dto.amountUSD)) {
          return { response: 'not enough balance for transaction' };
        }
        destinationWallet = dto.wallet;
        userCurrentCryptoBalance = await this.walletRepository.findOne({
          where: { account: destinationWallet },
        });
        if (dto.trade === 'buy') {
          const amountInTargetCoin =
            Number(userBalanceUSD.balanceUSD) / currentCoinPrice;
          const userUpdatedCryptoBalance =
            Number(userCurrentCryptoBalance.balanceBNB) + amountInTargetCoin;
          await this.walletRepository.update(userCurrentCryptoBalance.id, {
            balanceBNB: userUpdatedCryptoBalance.toString(),
          });
          const newBalanceUSD =
            Number(userBalanceUSD.balanceUSD) - Number(dto.amountUSD);
          await this.profileRepository.update(
            { auth_id: dto.auth_id },
            {
              balanceUSD: newBalanceUSD.toString(),
            },
          );
        } else if (dto.trade === 'sell') {
          if (
            !(
              Number(userCurrentCryptoBalance.balanceBNB) -
                Number(dto.amountCrypto) >
              0
            )
          ) {
            return { response: 'not enough crypto balance' };
          }
          const userUpdatedCryptoBalance =
            Number(userCurrentCryptoBalance.balanceBNB) -
            Number(dto.amountCrypto);
          const newBalanceUSD =
            Number(userBalanceUSD.balanceUSD) +
            currentCoinPrice * Number(dto.amountCrypto);
          await this.walletRepository.update(userCurrentCryptoBalance.id, {
            balanceBNB: userUpdatedCryptoBalance.toString(),
          });
          await this.profileRepository.update(
            { auth_id: dto.auth_id },
            { balanceUSD: newBalanceUSD.toString() },
          );
        }
        break;
      case 'SOL':
        response = await fetch(
          `https://api.coinbase.com/v2/exchange-rates?currency=${dto.coin}`,
        );
        data = await response.json();
        currentCoinPrice = Number(data.data.rates.USD);
        if (Number(userBalanceUSD.balanceUSD) < Number(dto.amountUSD)) {
          return { response: 'not enough balance for transaction' };
        }
        destinationWallet = dto.wallet;
        userCurrentCryptoBalance = await this.walletRepository.findOne({
          where: { account: destinationWallet },
        });
        if (dto.trade === 'buy') {
          const amountInTargetCoin =
            Number(userBalanceUSD.balanceUSD) / currentCoinPrice;
          const userUpdatedCryptoBalance =
            Number(userCurrentCryptoBalance.balanceSOL) + amountInTargetCoin;
          await this.walletRepository.update(userCurrentCryptoBalance.id, {
            balanceSOL: userUpdatedCryptoBalance.toString(),
          });
          const newBalanceUSD =
            Number(userBalanceUSD.balanceUSD) - Number(dto.amountUSD);
          await this.profileRepository.update(
            { auth_id: dto.auth_id },
            {
              balanceUSD: newBalanceUSD.toString(),
            },
          );
        } else if (dto.trade === 'sell') {
          if (
            !(
              Number(userCurrentCryptoBalance.balanceSOL) -
                Number(dto.amountCrypto) >
              0
            )
          ) {
            return { response: 'not enough crypto balance' };
          }
          const userUpdatedCryptoBalance =
            Number(userCurrentCryptoBalance.balanceSOL) -
            Number(dto.amountCrypto);
          const newBalanceUSD =
            Number(userBalanceUSD.balanceUSD) +
            currentCoinPrice * Number(dto.amountCrypto);
          await this.walletRepository.update(userCurrentCryptoBalance.id, {
            balanceSOL: userUpdatedCryptoBalance.toString(),
          });
          await this.profileRepository.update(
            { auth_id: dto.auth_id },
            { balanceUSD: newBalanceUSD.toString() },
          );
        }
        break;
      case 'XRP':
        response = await fetch(
          `https://api.coinbase.com/v2/exchange-rates?currency=${dto.coin}`,
        );
        data = await response.json();
        currentCoinPrice = Number(data.data.rates.USD);
        if (Number(userBalanceUSD.balanceUSD) < Number(dto.amountUSD)) {
          return { response: 'not enough balance for transaction' };
        }
        destinationWallet = dto.wallet;
        userCurrentCryptoBalance = await this.walletRepository.findOne({
          where: { account: destinationWallet },
        });
        if (dto.trade === 'buy') {
          const amountInTargetCoin =
            Number(userBalanceUSD.balanceUSD) / currentCoinPrice;
          const userUpdatedCryptoBalance =
            Number(userCurrentCryptoBalance.balanceXRP) + amountInTargetCoin;
          await this.walletRepository.update(userCurrentCryptoBalance.id, {
            balanceXRP: userUpdatedCryptoBalance.toString(),
          });
          const newBalanceUSD =
            Number(userBalanceUSD.balanceUSD) - Number(dto.amountUSD);
          await this.profileRepository.update(
            { auth_id: dto.auth_id },
            {
              balanceUSD: newBalanceUSD.toString(),
            },
          );
        } else if (dto.trade === 'sell') {
          if (
            !(
              Number(userCurrentCryptoBalance.balanceXRP) -
                Number(dto.amountCrypto) >
              0
            )
          ) {
            return { response: 'not enough crypto balance' };
          }
          const userUpdatedCryptoBalance =
            Number(userCurrentCryptoBalance.balanceXRP) -
            Number(dto.amountCrypto);
          const newBalanceUSD =
            Number(userBalanceUSD.balanceUSD) +
            currentCoinPrice * Number(dto.amountCrypto);
          await this.walletRepository.update(userCurrentCryptoBalance.id, {
            balanceXRP: userUpdatedCryptoBalance.toString(),
          });
          await this.profileRepository.update(
            { auth_id: dto.auth_id },
            { balanceUSD: newBalanceUSD.toString() },
          );
        }
        break;
      case 'USDC':
        response = await fetch(
          `https://api.coinbase.com/v2/exchange-rates?currency=${dto.coin}`,
        );
        data = await response.json();
        currentCoinPrice = Number(data.data.rates.USD);
        if (Number(userBalanceUSD.balanceUSD) < Number(dto.amountUSD)) {
          return { response: 'not enough balance for transaction' };
        }
        destinationWallet = dto.wallet;
        userCurrentCryptoBalance = await this.walletRepository.findOne({
          where: { account: destinationWallet },
        });
        if (dto.trade === 'buy') {
          const amountInTargetCoin =
            Number(userBalanceUSD.balanceUSD) / currentCoinPrice;
          const userUpdatedCryptoBalance =
            Number(userCurrentCryptoBalance.balanceUSDC) + amountInTargetCoin;
          await this.walletRepository.update(userCurrentCryptoBalance.id, {
            balanceUSDC: userUpdatedCryptoBalance.toString(),
          });
          const newBalanceUSD =
            Number(userBalanceUSD.balanceUSD) - Number(dto.amountUSD);
          await this.profileRepository.update(
            { auth_id: dto.auth_id },
            {
              balanceUSD: newBalanceUSD.toString(),
            },
          );
        } else if (dto.trade === 'sell') {
          if (
            !(
              Number(userCurrentCryptoBalance.balanceUSDC) -
                Number(dto.amountCrypto) >
              0
            )
          ) {
            return { response: 'not enough crypto balance' };
          }
          const userUpdatedCryptoBalance =
            Number(userCurrentCryptoBalance.balanceUSDC) -
            Number(dto.amountCrypto);
          const newBalanceUSD =
            Number(userBalanceUSD.balanceUSD) +
            currentCoinPrice * Number(dto.amountCrypto);
          await this.walletRepository.update(userCurrentCryptoBalance.id, {
            balanceUSDC: userUpdatedCryptoBalance.toString(),
          });
          await this.profileRepository.update(
            { auth_id: dto.auth_id },
            { balanceUSD: newBalanceUSD.toString() },
          );
        }
        break;
      case 'ADA':
        response = await fetch(
          `https://api.coinbase.com/v2/exchange-rates?currency=${dto.coin}`,
        );
        data = await response.json();
        currentCoinPrice = Number(data.data.rates.USD);
        if (Number(userBalanceUSD.balanceUSD) < Number(dto.amountUSD)) {
          return { response: 'not enough balance for transaction' };
        }
        destinationWallet = dto.wallet;
        userCurrentCryptoBalance = await this.walletRepository.findOne({
          where: { account: destinationWallet },
        });
        if (dto.trade === 'buy') {
          const amountInTargetCoin =
            Number(userBalanceUSD.balanceUSD) / currentCoinPrice;
          const userUpdatedCryptoBalance =
            Number(userCurrentCryptoBalance.balanceADA) + amountInTargetCoin;
          await this.walletRepository.update(userCurrentCryptoBalance.id, {
            balanceADA: userUpdatedCryptoBalance.toString(),
          });
          const newBalanceUSD =
            Number(userBalanceUSD.balanceUSD) - Number(dto.amountUSD);
          await this.profileRepository.update(
            { auth_id: dto.auth_id },
            {
              balanceUSD: newBalanceUSD.toString(),
            },
          );
        } else if (dto.trade === 'sell') {
          if (
            !(
              Number(userCurrentCryptoBalance.balanceADA) -
                Number(dto.amountCrypto) >
              0
            )
          ) {
            return { response: 'not enough crypto balance' };
          }
          const userUpdatedCryptoBalance =
            Number(userCurrentCryptoBalance.balanceADA) -
            Number(dto.amountCrypto);
          const newBalanceUSD =
            Number(userBalanceUSD.balanceUSD) +
            currentCoinPrice * Number(dto.amountCrypto);
          await this.walletRepository.update(userCurrentCryptoBalance.id, {
            balanceADA: userUpdatedCryptoBalance.toString(),
          });
          await this.profileRepository.update(
            { auth_id: dto.auth_id },
            { balanceUSD: newBalanceUSD.toString() },
          );
        }
        break;
      case 'AVAX':
        response = await fetch(
          `https://api.coinbase.com/v2/exchange-rates?currency=${dto.coin}`,
        );
        data = await response.json();
        currentCoinPrice = Number(data.data.rates.USD);
        if (Number(userBalanceUSD.balanceUSD) < Number(dto.amountUSD)) {
          return { response: 'not enough balance for transaction' };
        }
        destinationWallet = dto.wallet;
        userCurrentCryptoBalance = await this.walletRepository.findOne({
          where: { account: destinationWallet },
        });
        if (dto.trade === 'buy') {
          const amountInTargetCoin =
            Number(userBalanceUSD.balanceUSD) / currentCoinPrice;
          const userUpdatedCryptoBalance =
            Number(userCurrentCryptoBalance.balanceAVAX) + amountInTargetCoin;
          await this.walletRepository.update(userCurrentCryptoBalance.id, {
            balanceAVAX: userUpdatedCryptoBalance.toString(),
          });
          const newBalanceUSD =
            Number(userBalanceUSD.balanceUSD) - Number(dto.amountUSD);
          await this.profileRepository.update(
            { auth_id: dto.auth_id },
            {
              balanceUSD: newBalanceUSD.toString(),
            },
          );
        } else if (dto.trade === 'sell') {
          if (
            !(
              Number(userCurrentCryptoBalance.balanceAVAX) -
                Number(dto.amountCrypto) >
              0
            )
          ) {
            return { response: 'not enough crypto balance' };
          }
          const userUpdatedCryptoBalance =
            Number(userCurrentCryptoBalance.balanceAVAX) -
            Number(dto.amountCrypto);
          const newBalanceUSD =
            Number(userBalanceUSD.balanceUSD) +
            currentCoinPrice * Number(dto.amountCrypto);
          await this.walletRepository.update(userCurrentCryptoBalance.id, {
            balanceAVAX: userUpdatedCryptoBalance.toString(),
          });
          await this.profileRepository.update(
            { auth_id: dto.auth_id },
            { balanceUSD: newBalanceUSD.toString() },
          );
        }
        break;
      case 'DOGE':
        response = await fetch(
          `https://api.coinbase.com/v2/exchange-rates?currency=${dto.coin}`,
        );
        data = await response.json();
        currentCoinPrice = Number(data.data.rates.USD);
        if (Number(userBalanceUSD.balanceUSD) < Number(dto.amountUSD)) {
          return { response: 'not enough balance for transaction' };
        }
        destinationWallet = dto.wallet;
        userCurrentCryptoBalance = await this.walletRepository.findOne({
          where: { account: destinationWallet },
        });
        if (dto.trade === 'buy') {
          const amountInTargetCoin =
            Number(userBalanceUSD.balanceUSD) / currentCoinPrice;
          const userUpdatedCryptoBalance =
            Number(userCurrentCryptoBalance.balanceDOGE) + amountInTargetCoin;
          await this.walletRepository.update(userCurrentCryptoBalance.id, {
            balanceDOGE: userUpdatedCryptoBalance.toString(),
          });
          const newBalanceUSD =
            Number(userBalanceUSD.balanceUSD) - Number(dto.amountUSD);
          await this.profileRepository.update(
            { auth_id: dto.auth_id },
            {
              balanceUSD: newBalanceUSD.toString(),
            },
          );
        } else if (dto.trade === 'sell') {
          if (
            !(
              Number(userCurrentCryptoBalance.balanceDOGE) -
                Number(dto.amountCrypto) >
              0
            )
          ) {
            return { response: 'not enough crypto balance' };
          }
          const userUpdatedCryptoBalance =
            Number(userCurrentCryptoBalance.balanceDOGE) -
            Number(dto.amountCrypto);
          const newBalanceUSD =
            Number(userBalanceUSD.balanceUSD) +
            currentCoinPrice * Number(dto.amountCrypto);
          await this.walletRepository.update(userCurrentCryptoBalance.id, {
            balanceDOGE: userUpdatedCryptoBalance.toString(),
          });
          await this.profileRepository.update(
            { auth_id: dto.auth_id },
            { balanceUSD: newBalanceUSD.toString() },
          );
        }
        break;
      case 'TRX':
        response = await fetch(
          `https://api.coinbase.com/v2/exchange-rates?currency=${dto.coin}`,
        );
        data = await response.json();
        currentCoinPrice = Number(data.data.rates.USD);
        if (Number(userBalanceUSD.balanceUSD) < Number(dto.amountUSD)) {
          return { response: 'not enough balance for transaction' };
        }
        destinationWallet = dto.wallet;
        userCurrentCryptoBalance = await this.walletRepository.findOne({
          where: { account: destinationWallet },
        });
        if (dto.trade === 'buy') {
          const amountInTargetCoin =
            Number(userBalanceUSD.balanceUSD) / currentCoinPrice;
          const userUpdatedCryptoBalance =
            Number(userCurrentCryptoBalance.balanceTRX) + amountInTargetCoin;
          await this.walletRepository.update(userCurrentCryptoBalance.id, {
            balanceTRX: userUpdatedCryptoBalance.toString(),
          });
          const newBalanceUSD =
            Number(userBalanceUSD.balanceUSD) - Number(dto.amountUSD);
          await this.profileRepository.update(
            { auth_id: dto.auth_id },
            {
              balanceUSD: newBalanceUSD.toString(),
            },
          );
        } else if (dto.trade === 'sell') {
          if (
            !(
              Number(userCurrentCryptoBalance.balanceTRX) -
                Number(dto.amountCrypto) >
              0
            )
          ) {
            return { response: 'not enough crypto balance' };
          }
          const userUpdatedCryptoBalance =
            Number(userCurrentCryptoBalance.balanceTRX) -
            Number(dto.amountCrypto);
          const newBalanceUSD =
            Number(userBalanceUSD.balanceUSD) +
            currentCoinPrice * Number(dto.amountCrypto);
          await this.walletRepository.update(userCurrentCryptoBalance.id, {
            balanceTRX: userUpdatedCryptoBalance.toString(),
          });
          await this.profileRepository.update(
            { auth_id: dto.auth_id },
            { balanceUSD: newBalanceUSD.toString() },
          );
        }
        break;
      case 'LINK':
        response = await fetch(
          `https://api.coinbase.com/v2/exchange-rates?currency=${dto.coin}`,
        );
        data = await response.json();
        currentCoinPrice = Number(data.data.rates.USD);
        if (Number(userBalanceUSD.balanceUSD) < Number(dto.amountUSD)) {
          return { response: 'not enough balance for transaction' };
        }
        destinationWallet = dto.wallet;
        userCurrentCryptoBalance = await this.walletRepository.findOne({
          where: { account: destinationWallet },
        });
        if (dto.trade === 'buy') {
          const amountInTargetCoin =
            Number(userBalanceUSD.balanceUSD) / currentCoinPrice;
          const userUpdatedCryptoBalance =
            Number(userCurrentCryptoBalance.balanceLINK) + amountInTargetCoin;
          await this.walletRepository.update(userCurrentCryptoBalance.id, {
            balanceLINK: userUpdatedCryptoBalance.toString(),
          });
          const newBalanceUSD =
            Number(userBalanceUSD.balanceUSD) - Number(dto.amountUSD);
          await this.profileRepository.update(
            { auth_id: dto.auth_id },
            {
              balanceUSD: newBalanceUSD.toString(),
            },
          );
        } else if (dto.trade === 'sell') {
          if (
            !(
              Number(userCurrentCryptoBalance.balanceLINK) -
                Number(dto.amountCrypto) >
              0
            )
          ) {
            return { response: 'not enough crypto balance' };
          }
          const userUpdatedCryptoBalance =
            Number(userCurrentCryptoBalance.balanceLINK) -
            Number(dto.amountCrypto);
          const newBalanceUSD =
            Number(userBalanceUSD.balanceUSD) +
            currentCoinPrice * Number(dto.amountCrypto);
          await this.walletRepository.update(userCurrentCryptoBalance.id, {
            balanceLINK: userUpdatedCryptoBalance.toString(),
          });
          await this.profileRepository.update(
            { auth_id: dto.auth_id },
            { balanceUSD: newBalanceUSD.toString() },
          );
        }
        break;
      default:
        return { result: 'coin not supported' };
    }
  }
}
