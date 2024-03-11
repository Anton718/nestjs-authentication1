import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class WalletEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  auth_id: number;

  @Column({ type: 'bigint' })
  account: string;

  @Column({ type: 'float' })
  balanceBTC: string;

  @Column({ type: 'float' })
  balanceETH: string;

  @Column({ type: 'float' })
  balanceUSDT: string;

  @Column({ type: 'float' })
  balanceBNB: string;

  @Column({ type: 'float' })
  balanceSOL: string;

  @Column({ type: 'float' })
  balanceXRP: string;

  @Column({ type: 'float' })
  balanceUSDC: string;

  @Column({ type: 'float' })
  balanceADA: string;

  @Column({ type: 'float' })
  balanceAVAX: string;

  @Column({ type: 'float' })
  balanceDOGE: string;

  @Column({ type: 'float' })
  balanceTRX: string;

  @Column({ type: 'float' })
  balanceLINK: string;
}
