import { UsersModule } from "./modules";

export const config = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'nestjs',
  entities: [UsersModule],
  synchronize: true,
};
