import { ActivityNotifications } from '@Class/Notifications/ActivityNotifications';
import { CommentsClass } from '@Class/Comment';
import { OnlineStatusClass } from '@Class/OnlineStatus';
import { SocketClass } from '@Class/Socket';
import useAuthentication from '@Hooks/useAuthentication';
import { useEffect } from 'react';
import { MessagesNotifications } from '@Class/Notifications/MessagesNotifications';
import { RtcSocket } from 'Service/rtc.service';

const SocketProvider = ({ children }: { children: JSX.Element }) => {
  const { data } = useAuthentication({});
  useEffect(() => {
    if (data?._userId) {
      let avatar = null;
      if (typeof data.avatar === 'string') {
        avatar = data.avatar;
      }
      const socket = SocketClass.getInstance(data._userId, {
        avatar,
        _name: data._name,
        _userId: data._userId,
        _userName: data._userName,
      });
      ActivityNotifications.createInstance(socket);
      CommentsClass.createInstance(socket);
      OnlineStatusClass.createInstance(socket);
      MessagesNotifications.createInstance(socket);
    }
  }, [data?._userId]);
  return children;
};
export { SocketProvider };
