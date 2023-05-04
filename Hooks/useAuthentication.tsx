import { CheckLogin, RefreshToken } from '@Apis/authentication.api';
import background from '@public/images/backgroundDefault.jpg';
import avatar from '@public/images/defaultAvatar.png';
import { useQuery } from '@tanstack/react-query';
import { FetchResponse } from '@Types/Comments/index';
import { UserData } from '@Types/User/User.type';
import { queryClient } from 'pages/_app';
interface AuthenticationProps {
  initials?: FetchResponse<UserData>;
  enabled?: boolean;
}

function useAuthentication(authProps: AuthenticationProps) {
  const { data, isLoading, ...props } = useQuery({
    queryKey: ['authentication'],
    queryFn: async () => {
      const data = await CheckLogin();
      if (data.status !== 200) {
        const res = await RefreshToken();
        if (res.status !== 200) {
          throw new Error(res.message);
        } else {
          // queryClient.setQueryData(['authentication'], { payload: { ...res.payload?.user } });
          if (res.payload?.token) {
            localStorage.setItem('accessToken', res.payload.token.accessToken);
            localStorage.setItem('refreshToken', res.payload.token.refreshToken);
          }
          if (res.payload?.user.length) {
            res.payload.user[0].avatar = res.payload.user[0].avatar ?? avatar;
            res.payload.user[0].background_img = res.payload.user[0].background_img ?? background;
          }
          return res.payload?.user?.[0];
        }
      }
      if (data.payload?.length) {
        data.payload[0].avatar = data.payload[0].avatar ?? avatar;
        data.payload[0].background_img = data.payload[0].background_img ?? background;
      }
      return data.payload?.[0];
    },
    staleTime: 60000 * 30,
    ...authProps,
  });

  return { data, isLoading, ...props };
}

export default useAuthentication;
