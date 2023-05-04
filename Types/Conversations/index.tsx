export enum ConversationState {
  'Sent' = 1,
  'Received',
  'Read',
}

export enum UIDRole {
  'owner' = 1,
  'co-owner',
  'member',
}

interface ConverSationsI {
  _idConversations: string;
}

export enum TypeConversation {
  'Delete' = 1,
}
export interface ConverSations extends ConverSationsI {
  _textId: string;
  _fromUID: string;
  _content: string;
  _createAt: string | Date;
  _state: ConversationState;
  _taggedUID: string | null;
  _type?: TypeConversation;
}

export type ConversationsData = {
  conversations: ConverSations[];
  type: 'straight' | 'reverse';
  isFetching: boolean;
  isFull?: boolean;
};

export interface MembersOfConversations extends ConverSationsI {
  _UID: string;
  _joinAt: string | Date;
  _role: UIDRole;
}
