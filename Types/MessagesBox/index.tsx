import { ConverSations } from '@Types/Conversations';
import { OnlineStatus } from '@Types/Friends/index.type';
import { User } from '@Types/User/User.type';

export type MessagesBoxI = Omit<OnlineStatus, 'avatar' | '_idFriends'> &
  Pick<User, 'avatar'> &
  Pick<ConverSations, '_idConversations'> & { _state: boolean; opened: boolean };
