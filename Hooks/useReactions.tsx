import { GetPostReactions } from '@Apis/postsReactions.api';
import { REACTIONS } from '@Constant/Reactions';
import { useQuery } from '@tanstack/react-query';
import { PostReactionsProps } from '@Types/Reactions';

function useReactions({ _postId }: Pick<PostReactionsProps, '_postId'>) {
  const { data, ...props } = useQuery({
    queryKey: [REACTIONS, _postId],
    queryFn: async () => {
      const data = await GetPostReactions({ _postId });
      if (data.status !== 200) {
        throw new Error(data.message);
      }

      return data.payload;
    },
    refetchOnMount: 'always',
    keepPreviousData: true,
    cacheTime: 60000 * 2,
    staleTime: 60000 * 2,
  });

  return { data, ...props };
}

export { useReactions };
