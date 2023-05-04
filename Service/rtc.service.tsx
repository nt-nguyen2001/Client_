import { io, Socket } from 'socket.io-client';

type makeCallT = {
  type: {
    audio: boolean;
    video: boolean;
  };
};

type makingCallIsFailT = {
  message: string;
  typeError: 'Reject';
};
class RtcSocket {
  private static instance: RtcSocket;
  private static instanceSocket: Socket;
  // private static isCall: boolean = false;
  private static cbGetStateConnection: (err?: makingCallIsFailT) => void = () => {};
  private static roomId: string;
  private static fromUID: string;
  private static typeDevice: { video: boolean; audio: boolean };
  private constructor() {}

  static init({ UID, onReceiveCalling }: { UID: string; onReceiveCalling: (fromUID: string) => void }) {
    if (this.instance === undefined) {
      this.instanceSocket = io(`${process.env.NEXT_PUBLIC_API_URL}/rtc`, {
        withCredentials: true,
        query: {
          UID,
        },
      });
      this.instance = new RtcSocket();
    }

    //event
    this.instanceSocket.on(
      'ring',
      ({
        audio,
        video,
        roomId,
        fromUID,
      }: {
        roomId: string;
        audio: boolean;
        video: boolean;
        fromUID: string;
      }) => {
        RtcSocket.typeDevice = {
          audio,
          video,
        };
        RtcSocket.roomId = roomId;
        RtcSocket.fromUID = fromUID;

        onReceiveCalling(fromUID);
      }
    );
    this.instanceSocket.on('makingCallIsFail', (payload: makingCallIsFailT) => {
      this.cbGetStateConnection(payload);
    });
    return this.instance;
  }
  makingCallIsFail(payload: makingCallIsFailT) {
    RtcSocket.instanceSocket.emit('makingCallIsFail', {
      ...payload,
      toUID: RtcSocket.fromUID,
    });
  }
  static getInstance() {
    if (this.instance === undefined) {
      throw new Error("RTC hasn't been created.");
    }
    return this.instance;
  }
  static makeRing({
    toUID,
    payload,
    cbGetStateConnection,
  }: {
    toUID: string;
    cbGetStateConnection: (err?: makingCallIsFailT) => void;
    payload: { roomId: string; audio: boolean; video: boolean };
  }) {
    RtcSocket.cbGetStateConnection = cbGetStateConnection;
    RtcSocket.instanceSocket.emit('ring', { toUID, payload });
  }
  acceptCall() {
    window.open(
      `${window.location.href}/Call?roomId=${RtcSocket.roomId}&video=${RtcSocket.typeDevice.video}&audio=${RtcSocket.typeDevice.audio}`,
      '_blank',
      "height=''width=''"
    );
  }
  rejectCall() {
    this.makingCallIsFail({ message: 'No answer.', typeError: 'Reject' });
  }
  // setIsCall(state: boolean) {
  //   RtcSocket.isCall = state;
  // }
  static makeCall({
    type,
    user_ring,
    fromUID,
    typeCall,
    roomId,
  }: makeCallT & { user_ring: string[]; fromUID: string; typeCall: '1' | '2'; roomId: string }) {
    // this.instance.setIsCall(true);
    // RtcSocket.instanceSocket.emit('ring', { user_ring, fromUID });
    // console.log(user_ring, fromUID);
    let a = `user_ring[0]=${user_ring[0]}`;
    for (let i = 1; i < user_ring.length; i++) {
      a += `&user_ring[${i}]=${user_ring[i]}`;
    }

    window.open(
      `${window.location.href}/Call?roomId=${roomId}&video=${type.video}&audio=${type.audio}&${a}&typeCall=${typeCall}&uid=${fromUID}`,
      '_blank',
      "height=''width=''"
    );
  }
  endCall() {
    // this.setIsCall(false);
  }
  disconnect() {
    RtcSocket.instanceSocket.disconnect();
  }
}
export { RtcSocket };
