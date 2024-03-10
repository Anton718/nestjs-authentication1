import { Injectable } from '@nestjs/common';

@Injectable()
export class CryptoService {
  constructor() {}
  async getRates() {
    const cryptos = [
      'BTC',
      'ETH',
      'USDT',
      'BNB',
      'SOL',
      'XRP',
      'USDC',
      'ADA',
      'AVAX',
      'DOGE',
      'TRX',
      'LINK',
    ];
    const cryptoObject = {};
    for (const coin of cryptos) {
      const response = await fetch(
        `https://api.coinbase.com/v2/exchange-rates?currency=${coin}`,
      );
      const data = await response.json();
      cryptoObject[data.data.currency] = data.data.rates.USD;
    }
    return cryptoObject;
  }
}
