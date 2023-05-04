import { typeRoomE } from '@features/CallPage/types';
import { io, Socket } from 'socket.io-client';

type signaling_sdp = {
  sdp: RTCSessionDescription;
  UID: string;
};
type signaling_ice = {
  ice: RTCIceCandidate;
  UID: string;
  type: 'answer' | 'offer';
};
type makeCallT = {
  type: {
    audio: boolean;
    video: boolean;
  };
};
class RtcClass {
  private socketInstance: Socket | undefined;
  private static instance: RtcClass;
  // private configuration = {
  //   iceServers: [
  //     {
  //       urls: ['stun:stun.l.google.com:19302'],
  //     },
  //   ],
  // };
  private peerConnection: RTCPeerConnection | undefined;
  private stream: MediaStream | undefined;
  private roomId: string | undefined;
  private typeRoom: keyof typeof typeRoomE | undefined;
  private usersInRoom: string[] | undefined;
  private sender: RTCRtpSender | undefined;
  private videoEl: HTMLVideoElement | undefined;
  private receiver: RTCRtpTransceiver | undefined;
  private static typeCall: {
    audio: boolean;
    video: boolean;
  } = {
    audio: false,
    video: false,
  };
  constructor({ UID, roomId }: { UID: string; roomId: string }) {
    this.socketInstance = io(`${process.env.NEXT_PUBLIC_API_URL}/roomsCall`, {
      withCredentials: true,
      query: {
        id: UID,
        roomId,
      },
    });
    this.roomId = roomId;

    this.socketInstance.on(
      'signaling_sdp',
      async ({ sdp, fromUID }: { sdp: RTCSessionDescription; fromUID: string }) => {
        if (sdp.type === 'offer') {
          // const peerConnection = this.createPeer();
          this.createAnswer({ sdp, peerConnection: this.peerConnection!, toUID: fromUID });
        } else {
          if (this.peerConnection) {
            this.createIce(fromUID, this.peerConnection);
          }
          this.peerConnection?.setRemoteDescription(sdp);
        }
      }
    );
    this.socketInstance.on('signaling_ice', (ice: RTCIceCandidate) => {
      if (ice) {
        this.peerConnection?.addIceCandidate(ice);
      }
    });
    this.socketInstance.on(
      'joinRoom',
      ({
        numberOfUsers,
        success,
        currentUsersInRoom,
        fnRing,
      }: {
        numberOfUsers: number;
        success: boolean;
        currentUsersInRoom: string[];
        fnRing?: () => void;
      }) => {
        if (numberOfUsers >= 1) {
          currentUsersInRoom.map((userId) => {
            this.createOffer({ peerConnection: this.peerConnection!, toUID: userId });
          });
        } else {
          if (fnRing) {
            fnRing();
          }
        }
      }
    );
  }
  async changeVideo(type: 'video' | 'audio', enabled: boolean) {
    // let newVideoStreamGrab = await navigator.mediaDevices.getUserMedia({
    //   video: true,
    // });
    const senders = this.peerConnection?.getSenders();

    this.stream?.getTracks().forEach(async (track) => {
      if (track.kind === type) {
        if (!enabled) {
          await this.receiver!.sender.replaceTrack(null);
          this.receiver!.direction = 'recvonly';
          // track.stop();
          senders!.map((sender) => {
            // this.peerConnection!.removeTrack(sender);
            // this.peerConnection?.removeTrack(sender);
          });
          // this.peerConnection?.close();

          if (this.receiver) {
            // this.receiver.direction = 'recvonly';
          }
          // if (sender) {
          // }
          // this.stream?.removeTrack(track);
        } else {
          await this.receiver!.sender.replaceTrack(this.stream!.getVideoTracks()[0]);
          this.receiver!.direction = 'sendonly';
          // this.stream?.addTrack(newVideoStreamGrab.getVideoTracks()[0]);
          // this.peerConnection?.addTrack(newVideoStreamGrab.getVideoTracks()[0]);
        }
        // track.enabled = enabled;
      }
    });
  }
  async init({
    type,
    rootEl,
    typeRoom,
    usersInRoom,
  }: makeCallT & {
    rootEl: HTMLElement;
    typeRoom: keyof typeof typeRoomE;
    usersInRoom: string[];
  }) {
    const stream = await navigator.mediaDevices.getUserMedia(type);
    const peerConnection = new RTCPeerConnection();
    peerConnection.addTransceiver(stream.getVideoTracks()[0], { direction: 'sendonly', streams: [stream] });
    const el = this.createStream(rootEl, stream);
    peerConnection.ontrack = ({ track, streams: [stream] }) => {
      el.srcObject = stream;
    };
    this.peerConnection = peerConnection;
    el.muted = true;
    this.videoEl = el;
    this.stream = stream;

    this.typeRoom = typeRoom;
    this.usersInRoom = usersInRoom;
    this.joinRoom();
  }
  private createStream(rootEl: HTMLElement, stream: MediaStream) {
    const videoEl = document.createElement('video');
    videoEl.srcObject = stream;
    videoEl.autoplay = true;
    videoEl.style.transform = 'scaleX(-1)';
    rootEl.append(videoEl);
    return videoEl;
  }
  private addTrack(peerConnection: RTCPeerConnection) {
    const root = document.getElementById('userList');
    if (!root) {
      throw new Error("root element video hasn't created.");
    }
  }
  // addStream() {
  //   this.stream?.getTracks().forEach((track) => {
  //     this.peerConnection?.addTrack(track, this.stream!);
  //   });
  //   if (this.peerConnection) this.addTrack(this.peerConnection);
  // }
  private createIce(toUID: string, peerConnection: RTCPeerConnection) {
    let ice: RTCIceCandidate;
    peerConnection!.onicecandidate = async (event) => {
      //Event that fires off when a new offer ICE candidate is created
      if (event.candidate) {
        // if (!ice) {
        //   ice = event.candidate;
        // }
        this.socketInstance?.emit('signaling_ice', { ice: event.candidate, uid: toUID });
      }
    };
  }

  private createPeer() {
    // const peerConnection = new RTCPeerConnection(this.configuration);
    const peerConnection = new RTCPeerConnection();
    this.peerConnection = peerConnection;
    if (this.stream === undefined) {
      throw new Error("Stream hasn't been created.");
    }
    peerConnection.addEventListener('connectionstatechange', (event) => {
      if (peerConnection.connectionState === 'connected') {
        // Peers connected!
      }
    });
    // this.addTrack(peerConnection);
    const remoteStream = new MediaStream();
    const root = document.getElementById('userList');
    const el = this.createStream(root!, remoteStream);

    // function A() {
    //   var ua = navigator.userAgent;
    //   var tem;
    //   var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    //   if (/trident/i.test(M[1])) {
    //     tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    //     return 'IE ' + (tem[1] || '');
    //   }
    //   if (M[1] === 'Chrome') {
    //     tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
    //     if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    //   }
    //   M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    //   if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    //   return M.join(' ');
    // }
    peerConnection.ontrack = (e) => {
      e.streams[0].onremovetrack = () => {};
      el.srcObject = e.streams[0];
      // remoteStream.addTrack(track);
      // track.onmute = () => {
      // };
      // stream.onremovetrack = () => {
      // };
      // stream.onaddtrack = () => {
      // };
      // track.onended = () => {
      // };
    };
    // const c = A();
    // if (c !== 'Firefox 111') {
    //   this.stream.getTracks().forEach((track) => {
    //     if (track.kind === 'video') {
    //       this.receiver = this.peerConnection!.addTransceiver(track, {
    //         direction: 'sendonly',
    //         streams: [this.stream!],
    //       });
    //     } else {
    //       this.peerConnection!.addTransceiver(track, {
    //         direction: 'sendonly',
    //         streams: [this.stream!],
    //       });
    //     }
    //     // if (this.stream) {
    //     //   peerConnection.addTransceiver(track, { streams: [this.stream] });
    //     // }
    //     // track.onended = () => {
    //     // };
    //     // this.sender = peerConnection.addTrack(track, this.stream!);
    //   });
    // }

    return peerConnection;
  }
  private async createOffer({ peerConnection, toUID }: { peerConnection: RTCPeerConnection; toUID: string }) {
    const offer = await peerConnection?.createOffer();
    this.socketInstance?.emit('signaling_sdp', { sdp: offer, uid: toUID });
    await peerConnection?.setLocalDescription(offer);
  }
  private async createAnswer({
    peerConnection,
    sdp,
    toUID,
  }: {
    sdp: RTCSessionDescription;
    peerConnection: RTCPeerConnection;
    toUID: string;
  }) {
    if (!peerConnection) {
      throw new Error("peer connection hasn't been created.");
    }

    await peerConnection.setRemoteDescription(sdp);
    this.createIce(toUID, peerConnection);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    this.socketInstance?.emit('signaling_sdp', { sdp: answer, uid: toUID });
  }
  private joinRoom() {
    this.socketInstance?.emit('joinRoom', {
      typeRoom: this.typeRoom,
      usersInRoom: this.usersInRoom,
    });
  }
  // makeCall(payload: makeCallT & { user_ring: string[]; fromUID: string; typeCall: '1' | '2' }) {
  // }
}
export { RtcClass };
