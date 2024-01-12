import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { hashSync } from 'bcrypt';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'firstName', type: 'varchar', length: 100, nullable: false })
  firstName: string;

  @Column({ name: 'lastName', type: 'varchar', length: 100, nullable: true })
  lastName: string;

  @Column({ name: 'email', type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ name: 'passwordHash', type: 'text', nullable: false })
  password: string;

  @CreateDateColumn({
    name: 'createdAt',
    type: 'timestamp',
    nullable: false,
    default: () => 'EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)',
  })
  createdAt: string;

  @UpdateDateColumn({
    name: 'updatedAt',
    type: 'timestamp',
    nullable: false,
    default: () => 'EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)',
  })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamp', nullable: true })
  deleted_at: string;

  @BeforeInsert()
  hashPassword() {
    this.password = hashSync(this.password, 12);
  }
}
