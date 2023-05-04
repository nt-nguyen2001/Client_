import { CONTACT } from '@Constant/Contact';
import { OnlineStatus } from '@Types/Friends/index.type';
import { queryClient } from 'pages/_app';
import { Socket } from 'socket.io-client';

class OnlineStatusClass {
  private static instance: OnlineStatusClass;
  private socket: Socket | undefined;
  private constructor(socket: Socket) {
    this.socket = socket;
    this.socket.on('online', (payload: OnlineStatus[] | OnlineStatus) => {
      queryClient.setQueryData<OnlineStatus[]>([CONTACT], (old = []) => {
        if (payload instanceof Array) {
          return [...payload, ...old];
        }

        return [payload, ...old];
      });
    });
    this.socket.on('offline', (id: string) => {
      queryClient.setQueryData<OnlineStatus[]>([CONTACT], (old = []) =>
        old.filter((user) => user._userId !== id)
      );
    });
  }
  static createInstance(socket: Socket) {
    if (this.instance === undefined) {
      if (!socket) {
        throw new Error('Socket is error');
      }
      this.instance = new OnlineStatusClass(socket);
    }
    return this.instance;
  }
  public static getInstance() {
    if (this.instance === undefined) {
      throw new Error('Instance of online status was not created!');
    }
    return this.instance;
  }
}
export { OnlineStatusClass };
