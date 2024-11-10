import { BaseEntity } from '../../core/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class PredictionOutcome extends BaseEntity {
  @Column({ type: 'varchar', length: 16 })
  title: string;

  @Column({ nullable: true })
  icon?: string;
}
