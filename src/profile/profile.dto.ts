export class profileDTO {
  private auth_id: number;
  username: string;
  info: string;
  constructor(auth_id: number, username: string, info: string) {
    this.auth_id = auth_id;
    this.username = username;
    this.info = info;
  }
}
