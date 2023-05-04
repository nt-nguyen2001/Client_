import { UpdateConversationsState } from '@Apis/conversations.api';
import { IncreaseMessagesNotifications } from '@Apis/messagesNotifications.api';
import { Announcements, DetailedAnnouncements } from '@Constant/Announcements';
import { CONVERSATIONS } from '@Constant/Conversations';
import announceSound from '@public/sounds/audio_file.mp3';
import { AnnouncementProps } from '@Types/Announcements';
import { ConverSations, ConversationsData, ConversationState } from '@Types/Conversations';
import { queryClient } from 'pages/_app';
import { Socket } from 'socket.io-client';

type payloadMessages = { toUID: string; _idConversations: string; _content: string } & ConverSations;

class MessagesNotifications {
  private static instance: MessagesNotifications;
  private socket: Socket | undefined;
  private constructor(socket: Socket) {
    this.socket = socket;
    this.socket.on('messagesNotifications', (payload: payloadMessages) => {
      const audio = new Audio(announceSound);
      const query = queryClient.getQueryData<ConverSations[]>([CONVERSATIONS, payload._idConversations]);
      if (query) {
        const { _content, _createAt, _fromUID, _idConversations, _taggedUID, _textId } = payload;
        queryClient.setQueryData<ConversationsData>(
          [CONVERSATIONS, payload._idConversations],
          (prev = { conversations: [], isFetching: false, type: 'straight', isFull: false }) => ({
            ...prev,
            conversations: [
              ...prev.conversations,
              {
                _content,
                _createAt,
                _fromUID,
                _idConversations,
                _state: ConversationState.Received,
                _taggedUID,
                _textId,
              },
            ],
          })
        );
      }
      audio.play().catch((err) => {});
      if (payload?.toUID && payload._idConversations) {
        queryClient.setQueryData<number>(['messages', payload.toUID], (prev = 0) => {
          return prev + 1;
        });
        UpdateConversationsState({
          _idConversations: payload?._idConversations,
          _state: ConversationState.Received,
        });
      }
    });
    this.socket.on(
      'receivedMessagesNotifications',
      ({ _content, _idConversations, toUID }: payloadMessages) => {
        queryClient.setQueryData<ConversationsData>(
          [CONVERSATIONS, _idConversations],
          (prev = { conversations: [], isFetching: false, type: 'straight', isFull: false }) => {
            const newConversations = prev.conversations.map((conversation) => {
              if (conversation._state == ConversationState.Sent) {
                conversation._state = ConversationState.Received;
              }
              return conversation;
            });
            return { ...prev, conversations: newConversations };
          }
        );
      }
    );
    this.socket.on('receivedMessages', ({ _idConversations }: Pick<payloadMessages, '_idConversations'>) => {
      queryClient.setQueryData<ConversationsData>(
        [CONVERSATIONS, _idConversations],
        (prev = { conversations: [], isFetching: false, type: 'straight', isFull: false }) => {
          const messages = prev?.conversations.map((message) => {
            if (message._state == ConversationState.Received) {
              message._state = ConversationState.Read;
            }
            return message;
          });
          return { ...prev, conversations: messages };
        }
      );
    });
  }
  static createInstance(socket: Socket) {
    if (this.instance === undefined) {
      if (!socket) {
        throw new Error('Socket is error');
      }
      this.instance = new MessagesNotifications(socket);
    }
    return this.instance;
  }
  static getInstance() {
    if (this.instance === undefined) {
      throw new Error('Instance of announcement was not created!');
    }
    return this.instance;
  }
  public create({ toUID, ...props }: payloadMessages) {
    IncreaseMessagesNotifications({ toUID }).catch((err) => {
      console.log(err);
    });
    if (this.socket !== undefined) {
      this.socket.emit('messagesNotifications', { toUID, ...props });
    }
  }
  public received(props: Pick<payloadMessages, '_idConversations' | 'toUID'>) {
    if (this.socket !== undefined) {
      this.socket.emit('receivedMessages', props);
    }
  }
}

export { MessagesNotifications };
