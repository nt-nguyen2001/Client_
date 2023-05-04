import { FetchResponse } from '@Types/Comments';
import { User } from '@Types/User/User.type';
import FetchData from '.';

export async function IncreaseMessagesNotifications({ toUID }: { toUID: string }) {
  const res = await FetchData.patch(`/api/notifications/messages/`, toUID);
  return await res.json();
}
export async function GetNumberOfMessagesNotifications({
  _userId,
}: Pick<User, '_userId'>): Promise<FetchResponse<{ numberOfMessages: number }>> {
  const res = await FetchData.get(`/api/notifications/messages/${_userId}`);
  return await res.json();
}

export async function CheckMessagesNotifications({ _UID }: { _UID: string }) {
  const res = await FetchData.patch(`/api/notifications/messages/${_UID}/quantity`, {});
  return await res.json();
}
