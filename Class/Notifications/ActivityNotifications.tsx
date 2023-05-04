import { CreateDetailedAnnouncements } from '@Apis/announcements.api';
import { Announcements, DetailedAnnouncements } from '@Constant/Announcements';
import announceSound from '@public/sounds/audio_file.mp3';
import { AnnouncementProps } from '@Types/Announcements';
import { queryClient } from 'pages/_app';
import { Socket } from 'socket.io-client';

class ActivityNotifications {
  private static instance: ActivityNotifications;
  private socket: Socket | undefined;
  private constructor(socket: Socket) {
    this.socket = socket;
    this.socket.on('announce', (payload) => {
      const audio = new Audio(announceSound);
      audio.play().catch((err) => {});

      queryClient.setQueryData<{ quantity: number }>([Announcements], (old) => ({
        quantity: Number(old?.quantity ?? 0) + 1,
      }));
      const detailedAnnouncements = queryClient.getQueryData([DetailedAnnouncements]);
      if (detailedAnnouncements) {
        queryClient.setQueryData<AnnouncementProps[]>([DetailedAnnouncements], (old) => [
          payload,
          ...(old ?? []),
        ]);
      }
    });
  }
  static createInstance(socket: Socket) {
    if (this.instance === undefined) {
      if (!socket) {
        throw new Error('Socket is error');
      }
      this.instance = new ActivityNotifications(socket);
    }
    return this.instance;
  }
  static getInstance() {
    if (this.instance === undefined) {
      throw new Error('Instance of announcement was not created!');
    }
    return this.instance;
  }
  public create({ payload, toUserId }: { payload: AnnouncementProps; toUserId: string }) {
    CreateDetailedAnnouncements(payload).catch((err) => {
      console.log(err);
    });
    if (this.socket !== undefined) {
      this.socket.emit('announce', payload, toUserId);
    }
  }
}

export { ActivityNotifications };
