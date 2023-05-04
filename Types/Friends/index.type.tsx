import { User } from '@Types/User/User.type';
import { StaticImageData } from 'next/image';

export enum FriendsStatus {
  'Pending' = 1,
  'Friends',
  'Confirm Request',
  'Not Friends',
}

export interface FriendsI {
  _idFriends: string;
  _UID1: string;
  _UID2: string;
  _createAt: string | Date;
  _status: FriendsStatus;
}

export type OnlineStatus = Pick<User, '_userName' | '_userId' | '_name'> & {
  avatar: string | null | StaticImageData;
} & Pick<FriendsI, '_idFriends'>;
