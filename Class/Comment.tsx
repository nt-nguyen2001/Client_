import { COMMENTS } from '@Constant/Comments';
import { IComment } from '@Types/Comments';
import { User } from '@Types/User/User.type';
import { queryClient } from 'pages/_app';
import { Socket } from 'socket.io-client';

class CommentsClass {
  private static instance: CommentsClass;
  private socket: Socket | undefined;
  private constructor(socket: Socket) {
    this.socket = socket;
    this.socket.on('comments', (payload: IComment) => {
      queryClient.setQueryData<IComment[]>(
        [COMMENTS, payload._postsId, payload._parentId ?? ''],
        (old = []) => [payload, ...old]
      );
    });
  }
  static createInstance(socket: Socket) {
    if (this.instance === undefined) {
      if (!socket) {
        throw new Error('Socket is error');
      }
      this.instance = new CommentsClass(socket);
    }
    return this.instance;
  }
  public static getInstance() {
    if (this.instance === undefined) {
      throw new Error('Instance of comment was not created!');
    }
    return this.instance;
  }
  public forwardComments(payload: IComment, { _userId }: Pick<User, '_userId'>) {
    if (this.socket) {
      this.socket.emit('comments', payload, _userId);
    }
  }
}
export { CommentsClass };
