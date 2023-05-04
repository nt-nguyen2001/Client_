import { GetDetailedAnnouncements, ReadAnnouncement } from '@Apis/announcements.api';
import { DetailedAnnouncements } from '@Constant/Announcements';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AnnouncementProps } from '@Types/Announcements';
import { queryClient } from 'pages/_app';
import useAuthentication from './useAuthentication';

function useDetailedAnnouncements() {
  const authentication = useAuthentication({});
  const _userId = authentication.data?._userId || '';
  const { data, ...props } = useQuery({
    queryKey: [DetailedAnnouncements],
    queryFn: async () => {
      const data = await GetDetailedAnnouncements({ _userId });
      if (data.status !== 200) {
        throw new Error(data.message);
      }
      return data.payload;
    },
    enabled: _userId ? true : false,
    placeholderData: [],
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: (id: string) => {
      queryClient.setQueryData<AnnouncementProps[]>([DetailedAnnouncements], (old) => {
        if (old) {
          const newAnnouncements = old.map((announcement) => {
            if (announcement._idAnnouncement === id) {
              announcement.state = 1;
            }
            return announcement;
          });
          return newAnnouncements;
        }
        return old;
      });
      return ReadAnnouncement(id);
    },
  });

  const ReadAnnouncements = (id: string) => {
    mutation.mutate(id);
  };

  return { data: data!, ...props, ReadAnnouncements };
}

export { useDetailedAnnouncements };
