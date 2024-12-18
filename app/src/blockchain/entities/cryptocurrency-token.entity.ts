import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { Chain } from './chain.entity';
import { CryptoTokenEnum } from '../enums/crypto-token.enum';

@Entity('cryptocurrency_token')
export class CryptocurrencyToken extends BaseEntity {
  @Column({ type: 'varchar', length: 64 })
  name: string;

  @Column({
    type: 'varchar',
    length: 16,
    default: CryptoTokenEnum.WETH9.toString(),
    enum: CryptoTokenEnum,
    enumName: 'CryptoTokenEnum',
  })
  symbol: string;

  @Column({ name: 'chain_id' })
  chainId: number;

  @ManyToOne(() => Chain, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chain_id' })
  chain: Chain;

  @Column()
  address: string;

  @Column({ name: 'decimals', default: null, type: 'smallint' })
  decimals?: number;

  @Column({ type: 'jsonb', nullable: true })
  abi?: Record<string, unknown>[];

  @Column({ nullable: true })
  icon?: string;
}
