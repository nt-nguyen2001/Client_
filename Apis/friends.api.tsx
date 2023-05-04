import { FetchResponse } from '@Types/Comments';
import { AcceptedFriends, DeletedFriendsInvitation, GotFriends } from '@Types/Friends/friends.api.type';
import { FriendsI } from '@Types/Friends/index.type';
import FetchData from '.';

export async function GetFriendStatus({
  _UID1,
  _UID2,
}: Pick<FriendsI, '_UID1' | '_UID2'>): Promise<FetchResponse<GotFriends>> {
  const res = await FetchData.get(`/api/friends/?id1=${_UID1}&id2=${_UID2}`);
  return res.json();
}
export async function MakeFriend(payload: Omit<FriendsI, '_idFriends'>): Promise<FetchResponse<FriendsI>> {
  const res = await FetchData.post(`/api/friends/`, payload);
  return res.json();
}
export async function DeleteInvitation({ _idFriends, _receivedUserId }: DeletedFriendsInvitation) {
  const res = await FetchData.delete(`/api/friends/invitation/${_receivedUserId}/${_idFriends}`);
  return res.json();
}
export async function AcceptFriends(payload: AcceptedFriends): Promise<FetchResponse<AcceptedFriends>> {
  const res = await FetchData.patch(`/api/friends/`, payload);
  return res.json();
}
