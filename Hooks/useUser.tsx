import { GetUser } from '@Apis/user.api';
import { useQuery } from '@tanstack/react-query';
import avatar from '@public/images/defaultAvatar.png';
import background from '@public/images/backgroundDefault.jpg';

function useUser(userName: string) {
  const { data, ...props } = useQuery({
    queryKey: ['user', userName],
    queryFn: async () => {
      const data = await GetUser(userName);
      if (data.status !== 200) {
        throw new Error(data.message);
      }
      if (data.payload?.length) {
        data.payload[0].avatar = data.payload[0].avatar ?? avatar;
        data.payload[0].background_img = data.payload[0].background_img ?? background;
      }
      return data;
    },
    staleTime: 60000 * 30,
    cacheTime: userName ? 60000 * 30 : 0,
    enabled: userName ? true : false,
  });
  return { data: data?.payload?.[0], ...props };
}

export default useUser;
