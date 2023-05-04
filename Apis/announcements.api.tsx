import { AnnouncementPayload, AnnouncementProps } from '@Types/Announcements';
import { FetchResponse } from '@Types/Comments/index';
import { User } from '@Types/User/User.type';
import FetchData from 'Apis';
// import {GetAnnouncements} from "@Types/Announcements/announcements.api";

export async function GetAnnouncements({
  _userId,
}: Pick<User, '_userId'>): Promise<FetchResponse<{ quantity: string | number }>> {
  const res = await FetchData.get(`/api/announcements/${_userId}`);
  return await res.json();
}

export async function GetDetailedAnnouncements({
  _userId,
}: Pick<User, '_userId'>): Promise<FetchResponse<AnnouncementProps[]>> {
  const res = await FetchData.get(`/api/detailedAnnouncement/${_userId}`);
  return await res.json();
}
export async function CreateDetailedAnnouncements(
  payload: AnnouncementPayload
): Promise<FetchResponse<AnnouncementProps[]>> {
  const res = await FetchData.post(`/api/detailedAnnouncement/`, payload);
  return await res.json();
}
export async function CreateAnnouncements({
  _userId,
}: Pick<User, '_userId'>): Promise<FetchResponse<unknown>> {
  const res = await FetchData.post(`/api/announcements/`, _userId);
  return await res.json();
}
export async function ReadAnnouncement(idAnnouncement: string): Promise<FetchResponse<{ id: string }>> {
  const res = await FetchData.patch(`/api/detailedAnnouncement/`, {
    id: idAnnouncement,
  });
  return await res.json();
}
export async function CheckAnnouncements({
  _userId,
}: Pick<User, '_userId'>): Promise<FetchResponse<unknown>> {
  const res = await FetchData.patch(`/api/announcements/`, { _userId });
  return await res.json();
}
export async function DeleteDetailedAnnouncement({
  _idAnnouncement,
  _userId,
}: Pick<AnnouncementProps, '_idAnnouncement' | '_userId'>) {
  const res = await FetchData.delete(
    `/api/detailedAnnouncement/?idAnnouncement=${_idAnnouncement}&userId=${_userId}`
  );
  return await res.json();
}
export async function DeleteDetailedAnnouncementByIdOther({ userId, id }: { userId: string; id: string }) {
  const res = await FetchData.delete(`/api/detailedAnnouncement/idOther/?id=${id}&userId=${userId}`);
  return await res.json();
}
