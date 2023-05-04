import { CheckAnnouncements, GetAnnouncements } from '@Apis/announcements.api';
import { Announcements } from '@Constant/Announcements';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FetchResponse } from '@Types/Comments/index';
import { queryClient } from 'pages/_app';
import useAuthentication from './useAuthentication';

function useAnnouncements() {
  const authentication = useAuthentication({});
  const _userId = authentication.data?._userId || '';
  const { data, ...props } = useQuery({
    queryKey: [Announcements],
    queryFn: async () => {
      const res = await GetAnnouncements({ _userId });
      if (res.status !== 200) {
        throw new Error(res.message);
      }
      return { quantity: res.payload?.quantity || 0 };
    },
    enabled: _userId ? true : false,
  });
  const { mutate } = useMutation<FetchResponse<unknown>, unknown, unknown>({
    mutationFn: () => {
      queryClient.setQueryData([Announcements], 0);
      return CheckAnnouncements({ _userId });
    },
    onSuccess: (data) => {
      if (data.status !== 200) {
        throw new Error(data.message);
      }
    },
  });
  const handleReadAnnouncements = () => {
    mutate(undefined);
  };
  return {
    quantity: data?.quantity ? Number(data.quantity) : 0,
    ...props,
    handleReadAnnouncements,
  };
}

export { useAnnouncements };
