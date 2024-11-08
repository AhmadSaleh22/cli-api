import { BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany } from "typeorm";
import { hashPassword } from '../utils/passwords.security';
import { Roles } from "src/types";
import { Role } from "./roles.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id'
    }
  })
  roles: Role[];

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
