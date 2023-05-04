import { StaticImageData } from 'next/image';

export enum TypeLink {
  'Post' = 1,
  'User',
}
export interface AnnouncementPayload {
  _idAnnouncement: string;
  _userId: string;
  _typeLink: TypeLink;
  _idLink: string;
  _type: keyof typeof announcementType | null;
  state: string | number;
  _fromUser: string;
  _createAt: string | Date;
  _idOther: string;
}

export interface AnnouncementProps extends AnnouncementPayload {
  avatar: string | StaticImageData;
  _name: string;
  _toUserName: string;
}

export enum announcementType {
  'comment on your post.' = 1,
  'mentioned you in a comment.',
  'replied to your comment on his post.',
  'replied to your comment on another post.',
  'replied to your comment on your post.',
  'reacted to your comment.',
  'reacted to your post.',
  'sent you a friend request.',
}
