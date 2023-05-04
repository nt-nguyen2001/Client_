import { GetConversationsByUID } from '@Apis/conversations.api';
import { CONVERSATIONS } from '@Constant/Conversations';
import useAuthentication from '@Hooks/useAuthentication';
import { useQuery } from '@tanstack/react-query';

export function useMessagesConversations() {
  const { data } = useAuthentication({});
  const query = useQuery({
    queryKey: [CONVERSATIONS, data?._userId],
    queryFn: async () => {
      const res = await GetConversationsByUID({ _fromUID: data?._userId || '' });
      if (res.status !== 200) {
        throw new Error(res.message);
      }
      return res.payload || [];
    },
    enabled: data?._userId ? true : false,
  });
  return query;
}
