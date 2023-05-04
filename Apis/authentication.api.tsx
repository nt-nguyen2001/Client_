import { FetchResponse } from '@Types/Comments/index';
import { UserAuthentication } from '@Types/User/User.api';
import { User } from '@Types/User/User.type';
import FetchData from 'Apis';

export async function CheckLogin(headers?: HeadersInit): Promise<FetchResponse<UserAuthentication[]>> {
  const accessToken = localStorage.getItem('accessToken') || '';
  const res = await FetchData.get('/api/auth/verifyLogin', {
    credentials: 'include',
    headers: {
      'access-token': accessToken,
    },
  });
  return await res.json();
}
type LoginType = {
  role: string;
  _userName: string;
  _name: string;
  _userId: string;
  avatar: string;
  background_img: string;
};
export async function Login(payload: { _account: string; _password: string }): Promise<
  FetchResponse<
    { user: UserAuthentication[] } & {
      token: {
        accessToken: string;
        refreshToken: string;
      };
    }
  >
> {
  const res = await FetchData.post('/api/auth/login', payload, { credentials: 'include' });
  return await res.json();
}
export async function LogOut() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  const refreshToken = localStorage.getItem('refreshToken') || '';
  return FetchData.get('/api/auth/LogOut', {
    credentials: 'include',
    headers: { 'refresh-token': refreshToken },
  });
}
export async function Register(payload: Omit<User, 'role' | 'avatar' | 'background_img'>) {
  const res = await FetchData.post('/api/auth/register', payload, { credentials: 'include' });
  return await res.json();
}
export async function RefreshToken(): Promise<
  FetchResponse<
    { user: UserAuthentication[] } & {
      token: {
        accessToken: string;
        refreshToken: string;
      };
    }
  >
> {
  const refreshToken = localStorage.getItem('refreshToken') || '';
  const res = await FetchData.get('/api/auth/refreshToken', {
    credentials: 'include',
    headers: { 'refresh-token': refreshToken },
  });
  return await res.json();
}
