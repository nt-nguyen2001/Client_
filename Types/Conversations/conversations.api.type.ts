import { ConverSations, MembersOfConversations } from '.';

export type CreatedConverSationsPayload = {
  conversations: ConverSations;
  member: MembersOfConversations[];
};
export type GotConversations = Pick<ConverSations, '_idConversations'>;
export type UpdatedConversationsState = Pick<ConverSations, '_idConversations' | '_state'>;
export type DeletedMessages = Pick<ConverSations, '_idConversations' | '_textId'>;
