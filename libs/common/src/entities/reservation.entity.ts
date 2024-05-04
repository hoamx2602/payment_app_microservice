import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '@app/common';

@Entity()
export class Reservation extends AbstractEntity<Reservation> {
  @Column()
  timestamp: Date;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column()
  user_id: number;

  @Column()
  invoice_id: string;
}
