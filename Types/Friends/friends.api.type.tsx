import { FriendsI } from './index.type';

export type GotFriends = Pick<FriendsI, '_status' | '_createAt' | '_idFriends'>;
export type DeletedFriendsInvitation = Pick<FriendsI, '_idFriends'> & { _receivedUserId: string };
export type AcceptedFriends = Pick<FriendsI, '_idFriends' | '_createAt'>;
