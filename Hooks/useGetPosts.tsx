import { GetPostsByUserId } from '@Apis/posts.api';
import { useQuery } from '@tanstack/react-query';
import { PaginationI } from '@Types/pagination.type';
import { User } from '@Types/User/User.type';

function useGetPosts(userName: string, { _userId }: Pick<User, '_userId'>, pagination: PaginationI) {
  const { data, ...props } = useQuery({
    queryKey: ['userPosts', userName],
    queryFn: async () => {
      const data = await GetPostsByUserId(userName, _userId, pagination);
      // console.log(data.payload);
      if (data.status !== 200) {
        throw new Error(data.message);
      }

      return data.payload;
    },
    enabled: userName ? true : false,
    cacheTime: userName ? 60000 * 3 : 0,
    staleTime: 60000 * 3,
  });

  return { data, ...props };
}

export default useGetPosts;
