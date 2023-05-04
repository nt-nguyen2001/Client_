import { FCUpdateUser, GotInfoFriends } from '@Types/User/User.api';
import { User, UserData } from '@Types/User/User.type';
import FetchData from 'Apis';
import { FetchResponse } from '../Types/Comments';
import { FriendsI } from '@Types/Friends/index.type';

export async function CheckUserExists<T>(params: string = ''): Promise<FetchResponse<T>> {
  const res = await FetchData.get(`/api/auth/userExists/${params}`, {
    credentials: 'include',
  });
  return await res.json();
}

const UpdateUser: FCUpdateUser = async (id, payload) => {
  const res = await FetchData.patch(`/api/users/${id}`, payload, { credentials: 'include' });
  return await res.json();
};
export { UpdateUser };

export async function GetUser(userName: string): Promise<FetchResponse<UserData[]>> {
  const res = await FetchData.get(`/api/users/${userName}`);
  return await res.json();
}

export async function UpdateInfoUser(payload: Partial<UserData>) {
  const res = await FetchData.patch(`/api/users/info/`, payload);
  return await res.json();
}

export async function GetNumberOfPosts({
  _userId,
}: Pick<UserData, '_userId'>): Promise<FetchResponse<{ quantity: number }>> {
  const res = await FetchData.get(`/api/posts/quantity/user/${_userId}`);
  return await res.json();
}

export async function GetInfoFriends({
  _userId,
}: Pick<UserData, '_userId'>): Promise<FetchResponse<GotInfoFriends>> {
  const res = await FetchData.get(`/api/users/${_userId}/infoFriends`);
  return await res.json();
}

export async function CheckExistedUserName({
  _userName,
}: Pick<User, '_userName'>): Promise<FetchResponse<unknown>> {
  const res = await FetchData.get(`/api/users/userName/${_userName}`);
  return await res.json();
}

export async function getInfoUser({ _userId }: Pick<User, '_userId'>): Promise<FetchResponse<User[]>> {
  const res = await FetchData.get(`/api/users/id/${_userId}`);
  return await res.json();
}

export async function ChangePass({
  UID,
  oldPassword,
  newPassword,
}: {
  UID: string;
  newPassword: string;
  oldPassword: string;
}): Promise<FetchResponse<unknown>> {
  const res = await FetchData.post(`/api/users/id/${UID}/verifyPassword?pass=${oldPassword}`, {
    pass: newPassword,
  });
  return await res.json();
}
export async function SearchUsersByName({
  userName,
}: {
  userName: string;
}): Promise<
  FetchResponse<(Pick<User, '_userId' | '_userName' | 'avatar' | '_name'> & Pick<FriendsI, '_status'>)[]>
> {
  const res = await FetchData.get(`/api/users/search/${userName}`);
  return await res.json();
}
