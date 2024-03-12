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
