export class profileDTO {
  private auth_id: number;
  username: string;
  info: string;
  private dateCreated: string;
  constructor(
    auth_id: number,
    username: string,
    info: string,
    dateCreated: string,
  ) {
    this.auth_id = auth_id;
    this.username = username;
    this.info = info;
    this.dateCreated = dateCreated;
  }
}
