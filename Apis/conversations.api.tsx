import { FetchResponse } from '@Types/Comments';
import { ConverSations } from '@Types/Conversations';
import {
  DeletedMessages,
  GotConversations,
  UpdatedConversationsState,
} from '@Types/Conversations/conversations.api.type';
import { PaginationI } from '@Types/pagination.type';
import { User } from '@Types/User/User.type';
import FetchData from 'Apis';

export async function CreateConversations(
  props: ConverSations,
  { toUID }: { toUID: string }
): Promise<FetchResponse<{ conversation: ConverSations } & { toUID: string }>> {
  const res = await FetchData.post(`/api/conversations`, props);
  const data = (await res.json()) as FetchResponse<{ conversation: ConverSations }>;
  return { ...data, payload: data.payload ? { ...data.payload, toUID } : undefined };
}

export async function GetConversationsById({
  _idConversations,
  limit,
  offset,
}: GotConversations & PaginationI): Promise<FetchResponse<ConverSations[]>> {
  const res = await FetchData.get(`/api/conversations/${_idConversations}/?limit=${limit}&offset=${offset}`);
  return await res.json();
}
export async function GetConversationsByUID({
  _fromUID,
}: Pick<ConverSations, '_fromUID'>): Promise<
  FetchResponse<(ConverSations & Pick<User, '_userId' | '_userName' | '_name' | 'avatar'>)[]>
> {
  const res = await FetchData.get(`/api/conversations/UID/${_fromUID}`);
  return await res.json();
}

export async function UpdateConversationsState({
  _idConversations,
  _state,
}: UpdatedConversationsState): Promise<FetchResponse<ConverSations>> {
  const res = await FetchData.patch(`/api/conversations/${_idConversations}/state`, { _state });
  return await res.json();
}

export async function DeleteMessages({
  _textId,
  ...props
}: DeletedMessages): Promise<FetchResponse<DeletedMessages>> {
  const res = await FetchData.delete(`/api/conversations/messages/${_textId}`, { ...props });
  return await res.json();
}
