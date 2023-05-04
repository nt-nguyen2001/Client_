import {
  CheckMessagesNotifications,
  GetNumberOfMessagesNotifications,
} from '@Apis/messagesNotifications.api';
import useAuthentication from '@Hooks/useAuthentication';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from 'pages/_app';
import { RiSendPlaneFill } from 'react-icons/ri';
import { Notifications } from '../Notifications';
import { MessagesNotificationsContainer } from './MessagesNotificationsContainer';
export function MessagesNotifications() {
  const auth = useAuthentication({});
  const { data } = useQuery({
    queryKey: ['messages', auth.data?._userId],
    queryFn: async () => {
      const res = await GetNumberOfMessagesNotifications({ _userId: auth.data?._userId || '' });
      if (res.status !== 200) {
        throw new Error(res.message);
      }
      return res.payload?.numberOfMessages;
    },
    enabled: auth.data?._userId ? true : false,
  });

  return (
    <>
      {
        <Notifications
          ComponentContainer={(props) => <MessagesNotificationsContainer {...props} />}
          cb={() => {
            CheckMessagesNotifications({ _UID: auth.data?._userId || '' });
            queryClient.setQueryData<number>(['messages', auth.data?._userId], (prev) => 0);
          }}
          icon={<RiSendPlaneFill />}
          quantity={data || 0}
        />
      }
    </>
  );
}
