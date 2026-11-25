
import type { User } from './user';

export interface UserList {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}
