export class profileDTO {
  private auth_id: number;
  username: string;
  private dateCreated: string;
  private balanceUSD: number;
  constructor(
    auth_id: number,
    username: string,
    dateCreated: string,
    balanceUSD: number,
  ) {
    this.auth_id = auth_id;
    this.username = username;
    this.dateCreated = dateCreated;
    this.balanceUSD = balanceUSD;
  }
}
