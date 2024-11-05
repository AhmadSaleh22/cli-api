import { BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany } from "typeorm";
import { hashPassword } from '../utils/passwords.security';
import { Roles } from "src/types";
import { Role } from "./roles.entity";

@Entity()
export class User {
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[];
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({
    type: 'set',
    enum: Roles,
    default: [Roles.USER]
  })
  role: Roles[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date();
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await hashPassword(this.password);
    }
  }
}
