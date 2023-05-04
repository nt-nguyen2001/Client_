import { FriendsI } from '@Types/Friends/index.type';
import { FetchResponse } from '../Comments';
import { User, UserData } from './User.type';

export type UserAuthentication = Pick<
  User,
  | '_userId'
  | '_name'
  | '_userName'
  | 'avatar'
  | 'background_img'
  | 'role'
  | '_account'
  | '_createAt'
  | '_phoneNumber'
>;

export type FCUpdateUser = (id: string, data: Partial<UserData>) => Promise<FetchResponse<UserData[]>>;

export type GotInfoFriends = {
  quantity: number;
  infoFriends: (Pick<FriendsI, '_idFriends' | '_createAt' | '_status'> &
    Pick<User, 'avatar' | '_userId' | '_userName' | '_name'>)[];
};
