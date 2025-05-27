// import { Conference } from 'src/conference/entities/conference.entity';
import { Conference } from '../../conference/entities/conference.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Feedbacks {
  @PrimaryGeneratedColumn()
  id: number; // Auto-generated primary key

  @ManyToOne(() => Conference, (conference) => conference.participants)
  @JoinColumn({ name: 'conference_id' })
  conference: Conference;

  @Column('int')
  clientID: number;

  @Column()
  room: string;

  @Column('int')
  evaluation: number;

  @Column('text', { nullable: true })
  comment: string;

  @CreateDateColumn()
  date: Date;

  @Column()
  userAgent: string;
}
