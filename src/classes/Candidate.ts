import {Address} from './Address'

export interface Candidate {
  name: string;
  address: Address;
  picture: string; // base64
  email: string;
  phoneNumber?: string;
  position?: string;
  introduction?: string;
}
