
import type { Address } from './address';
import type { Bank } from './bank';
import type { Company } from './company';
import type { Crypto } from './crypto';
import type { Hair } from './hair';

export interface UserInput {
  firstName?: string;
  lastName?: string;
  maidenName?: string;
  age?: number;
  gender?: string;
  email?: string;
  phone?: string;
  username?: string;
  password?: string;
  birthDate?: string;
  image?: string;
  bloodGroup?: string;
  height?: number;
  weight?: number;
  eyeColor?: string;
  hair?: Hair;
  address?: Address;
  macAddress?: string;
  university?: string;
  ip?: string;
  bank?: Bank;
  company?: Company;
  ein?: string;
  ssn?: string;
  userAgent?: string;
  crypto?: Crypto;
  role?: string;
}
