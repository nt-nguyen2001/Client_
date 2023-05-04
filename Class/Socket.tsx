import { OnlineStatus } from '@Types/Friends/index.type';
import { User } from '@Types/User/User.type';
import io, { Socket } from 'socket.io-client';

class SocketClass {
  private static instance: Socket;
  private constructor() {}
  public static getInstance(id: string, payload: Omit<OnlineStatus, '_idFriends'>) {
    if (id) {
      if (this.instance === undefined) {
        this.instance = io(`${process.env.NEXT_PUBLIC_API_URL}/announcement`, {
          withCredentials: true,
        });
        this.instance.on('connect', () => {
          this.instance.emit('connected', id, payload);
        });
      }
    } else {
      throw new Error('Id of socket is empty');
    }
    return this.instance;
  }
}
export { SocketClass };
