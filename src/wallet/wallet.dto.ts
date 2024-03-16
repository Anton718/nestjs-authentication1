export class walletDTO {
  auth_id: number;
  username: string;
  password: string;
  constructor(auth_id: number, username: string, password: string) {
    this.auth_id = auth_id;
    this.username = username;
    this.password = password;
  }
}

export class transactionDTO {
  auth_id: number;
  username: string;
  password: string;
  wallet: string;
  amountUSD: string;
  amountCrypto: string;
  coin: string;
  trade: string;
  constructor(
    auth_id: number,
    username: string,
    password: string,
    wallet: string,
    amountUSD: string,
    amountCrypto: string,
    coin: string,
    trade: string,
  ) {
    this.auth_id = auth_id;
    this.username = username;
    this.password = password;
    this.wallet = wallet;
    this.amountUSD = amountUSD;
    this.amountCrypto = amountCrypto;
    this.coin = coin;
    this.trade = trade;
  }
}
