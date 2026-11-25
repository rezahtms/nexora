
import type { UserInput } from './userInput';

export type User = UserInput & {
  id: number;
} & Required<Pick<UserInput & {
  id: number;
}, 'firstName' | 'lastName' | 'email' | 'phone' | 'image' | 'address' | 'company'>>;
