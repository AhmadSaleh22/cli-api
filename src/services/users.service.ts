import { Injectable } from '@nestjs/common';
import { User } from 'src/types';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  createUser(user: User) {
    this.users.push(user);
  }

  getUsers() {
    return this.users;
  }

  getUserByUsername(username: string) {
    return this.users.find((user) => user.username === username);
  }

  getUserByEmail(email: string) {
    return this.users.find((user) => user.email === email);
  }

  updateUser(user: User) {
    const index = this.users.findIndex((u) => u.username === user.username);
    this.users[index] = user;
  }
}
