
import type { AddressCoordinates } from './addressCoordinates';

export interface Address {
  address?: string;
  city?: string;
  state?: string;
  stateCode?: string;
  postalCode?: string;
  coordinates?: AddressCoordinates;
  country?: string;
}
