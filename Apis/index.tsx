import { FetchResponse } from '@Types/Comments/index';

const FetchData = {
  get: (url: string, options?: RequestInit) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
  },
  post: (url: string, payload: Object, options?: RequestInit) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: 'POST',
      body: JSON.stringify({ payload }),
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
  },
  patch: (url: string, payload: any, options?: RequestInit) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: 'PATCH',
      body: JSON.stringify({ payload }),
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
  },
  delete: (url: string, payload?: any, options?: RequestInit) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify({ payload }),
      ...options,
    });
  },
};
export default FetchData;
