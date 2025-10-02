import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('insights') // ✅ match Postgres table name
export class Insight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: false })
  summary: string;

  @Column({ type: 'varchar', nullable: true })
  sourceUrl?: string;

  @Column({ type: 'text', array: true, nullable: true })
  tags: string[];

 @ManyToOne(() => User, (user) => user.insights, {
  nullable: false,
  onDelete: 'CASCADE',
})
@JoinColumn({ name: 'userId' })
author: User;


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

