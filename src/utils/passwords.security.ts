import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePasswords(plainText: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}