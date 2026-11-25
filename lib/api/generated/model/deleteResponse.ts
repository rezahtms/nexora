
import type { User } from './user';

export type DeleteResponse = User & {
  isDeleted: boolean;
  deletedOn: string;
};
