import { Socket, io } from 'socket.io-client';

type JoinRoomEmitT = {
  typeRoom: 'P' | 'G';
  usersInRoom: string[];
  roomId: string;
  fnRing: (payload: { users: string[]; error?: string }) => void;
};
type JoinRoomOnT = {
  success: boolean;
  currentUsersInRoom: string[];
  usersRing: string[];
  messageError?: string;
};

type fnReceiveRemotePeer = (payload: { stream: MediaStream; id: string }) => void;

export class RoomsCallSocket {
  private static instanceSocket: Socket;
  private static instance: RoomsCallSocket;
  private static stream: MediaStream;
  private static rootEl: HTMLElement;
  private static videoEl: HTMLVideoElement;
  private static fnRing: (payload: { users: string[]; error?: string }) => void;
  private static receiveRemotePeer: fnReceiveRemotePeer;
  private static cbPeerDisconnected: (payload: { id: string }) => void;
  private static onSettled?: (response: any, error?: string) => void;
  private static onStateOfDevices?: (error?: string) => void;
  private static cbAddPeople: () => void;
  // private static peerConnection: RTCPeerConnection;
  private static usersConnected: Map<string, RTCPeerConnection> = new Map();

  private constructor(socket: Socket) {
    // events

    socket.on('joinRoom', (payload: JoinRoomOnT) => {
      if (payload.success) {
        payload.currentUsersInRoom.map((user) => {
          const peerConnection = this.createPeer({ uid: user });
          this.createOffer({ peerConnection, toId: user });
        });
      }

      RoomsCallSocket.fnRing({ users: payload.usersRing, error: payload.messageError });
    });
    socket.on('signaling_sdp', async ({ fromUID, sdp }: { sdp: RTCSessionDescription; fromUID: string }) => {
      if (sdp.type === 'offer') {
        const peerConnection = this.createPeer({ uid: fromUID });
        this.createAnswer({ peerConnection, sdp, toId: fromUID });
      } else {
        this.addAnswer({ sdp, uid: fromUID });
      }
    });
    socket.on('signaling_ice', ({ fromUID, ice }: { ice: RTCIceCandidate; fromUID: string }) => {
      if (ice) {
        RoomsCallSocket.usersConnected.get(fromUID)?.addIceCandidate(ice);
      }
    });
    socket.on('userDisconnected', (id) => {
      const peer = RoomsCallSocket.usersConnected.get(id);
      peer?.close();
      RoomsCallSocket.cbPeerDisconnected({ id });
    });
    socket.on('addPeople', (message) => {
      RoomsCallSocket.cbAddPeople();
    });
  }
  static init<TData = unknown>({
    UID,
    typeMedia,
    rootEl,
    yourEl,
    receiveRemotePeer,
    cbPeerDisconnected,
    onSettled,
    onStateOfDevices,
  }: {
    UID: string;
    rootEl: HTMLElement;
    typeMedia: {
      video: boolean;
      audio: boolean;
    };
    yourEl: HTMLVideoElement;
    cbPeerDisconnected: (payload: { id: string }) => void;
    receiveRemotePeer: fnReceiveRemotePeer;
    onSettled?: (response: TData, error?: string) => void;
    onStateOfDevices?: (error?: string) => void;
  }): Promise<{ socket: Socket; instance: RoomsCallSocket }> {
    return new Promise(async (resolve, reject) => {
      try {
        RoomsCallSocket.receiveRemotePeer = receiveRemotePeer;
        RoomsCallSocket.cbPeerDisconnected = cbPeerDisconnected;
        RoomsCallSocket.onSettled = onSettled;
        RoomsCallSocket.onStateOfDevices = onStateOfDevices;
        const media = await navigator.mediaDevices.getUserMedia(typeMedia);
        if (RoomsCallSocket.instance === undefined) {
          const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/roomsCall`, {
            withCredentials: true,
            query: {
              id: UID,
            },
          });
          socket.on('connect_error', (e) => {
            reject(e);
          });
          socket.on('connect', () => {
            const instance = new RoomsCallSocket(socket);

            RoomsCallSocket.instance = instance;
            RoomsCallSocket.instanceSocket = socket;
            RoomsCallSocket.rootEl = rootEl;
            RoomsCallSocket.stream = media;
            // const rootElOfYou = document.getElementById('you');

            RoomsCallSocket.videoEl = yourEl;
            yourEl.autoplay = true;
            yourEl.playsInline = true;
            yourEl.srcObject = media;
            // rootEl.append(rootElOfYou);

            // this.instance.createPeer({ uid: '1' });
            resolve({ socket, instance: RoomsCallSocket.instance });
          });
        } else {
          return { socket: RoomsCallSocket.instanceSocket, instance: RoomsCallSocket.instance };
        }
      } catch (e) {
        if (RoomsCallSocket.onStateOfDevices) {
          RoomsCallSocket.onStateOfDevices(e as string);
        }
      }
    });
  }

  joinRoom(payload: JoinRoomEmitT) {
    RoomsCallSocket.fnRing = payload.fnRing;
    RoomsCallSocket.instanceSocket.emit('joinRoom', payload);
  }
  disconnect() {
    RoomsCallSocket.stream.getTracks().forEach((track) => {
      RoomsCallSocket.stream.removeTrack(track);
      track.stop();
    });
    RoomsCallSocket.instanceSocket.disconnect();
  }
  async mute({ type, enabled }: { type: 'video' | 'audio'; enabled: boolean }) {
    if (enabled) {
      // const peerConnection = RoomsCallSocket.usersConnected.get()
      try {
        const tracks = await navigator.mediaDevices.getUserMedia({ [type]: true });
        const track = tracks.getTracks().find((track) => track.kind === type);

        if (track) {
          RoomsCallSocket.stream.addTrack(track);
          if (type === 'video') {
            RoomsCallSocket.videoEl.style.background = 'none';
            RoomsCallSocket.videoEl.srcObject = RoomsCallSocket.stream;
          }

          for (const [key, value] of RoomsCallSocket.usersConnected) {
            value.addTrack(track, RoomsCallSocket.stream);
            this.createOffer({ peerConnection: value, toId: key });
          }
        }
      } catch (e) {
        if (RoomsCallSocket.onStateOfDevices) {
          RoomsCallSocket.onStateOfDevices(e as string);
        }
      }
    } else {
      RoomsCallSocket.stream.getTracks().forEach((track) => {
        if (track.kind === type) {
          RoomsCallSocket.stream.removeTrack(track);
          if (type === 'video') {
            RoomsCallSocket.videoEl.srcObject = null;
            RoomsCallSocket.videoEl.style.background = '#222';
          }
          track.stop();
        }
      });
      for (const [key, value] of RoomsCallSocket.usersConnected) {
        const sender = value.getSenders().find((s) => s.track?.kind === type);
        if (sender) {
          value.removeTrack(sender);
          RoomsCallSocket.instance.createOffer({ peerConnection: value, toId: key });
        }
      }
    }
  }
  private createEl({ isMute = false, rootEl }: { isMute?: boolean; rootEl: HTMLElement }) {
    const el = document.createElement('video');
    if (isMute) {
      el.muted = true;
    }
    el.autoplay = true;
    el.style.transform = 'scaleX(-1)';
    el.playsInline = true;
    // rootEl.append(el);
    return el;
  }
  private createIce({ peerConnection, toId }: { peerConnection: RTCPeerConnection; toId: string }) {
    peerConnection.onicecandidate = (e) => {
      if (e.candidate) {
        RoomsCallSocket.instanceSocket.emit('signaling_ice', { ice: e.candidate, uid: toId });
      }
    };
  }
  private async createOffer({ peerConnection, toId }: { peerConnection: RTCPeerConnection; toId: string }) {
    try {
      const offer = await peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await peerConnection.setLocalDescription(offer);
      this.createIce({ peerConnection, toId });
      RoomsCallSocket.instanceSocket.emit('signaling_sdp', { sdp: offer, uid: toId });
    } catch (err) {}
  }
  private async createAnswer({
    peerConnection,
    sdp,
    toId,
  }: {
    peerConnection: RTCPeerConnection;
    toId: string;
    sdp: RTCSessionDescription;
  }) {
    await peerConnection.setRemoteDescription(sdp);
    this.createIce({ peerConnection, toId });
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    RoomsCallSocket.instanceSocket.emit('signaling_sdp', { sdp: answer, uid: toId });
  }
  private async addAnswer({ sdp, uid }: { sdp: RTCSessionDescription; uid: string }) {
    await RoomsCallSocket.usersConnected.get(uid)?.setRemoteDescription(sdp);
    if (RoomsCallSocket.onSettled) {
      RoomsCallSocket.onSettled('Connect successfully');
    }
  }
  private createPeer({ uid }: { uid: string }) {
    let peerConnection = RoomsCallSocket.usersConnected.get(uid);

    if (peerConnection === undefined) {
      peerConnection = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
      RoomsCallSocket.usersConnected.set(uid, peerConnection);

      RoomsCallSocket.stream.getTracks().forEach((track) => {
        peerConnection!.addTrack(track, RoomsCallSocket.stream);
      });

      peerConnection.onnegotiationneeded = () => {};

      peerConnection.addEventListener('connectionstatechange', (event) => {
        if (peerConnection?.connectionState === 'connected') {
          if (RoomsCallSocket.onSettled) {
            RoomsCallSocket.onSettled('Connect successfully');
          }
        }
      });

      // const remoteEl = RoomsCallSocket.instance.createEl({ rootEl: RoomsCallSocket.rootEl });
      peerConnection.ontrack = ({ track, streams: [stream] }) => {
        if (stream) {
          stream.onremovetrack = () => {
            // hmmmmm after a long timeeeeeeee
            // I found out, when create a new offer (renegotiation) it will be triggered
            // hmmmmm
            // remoteEl.srcObject = null;
            // remoteEl.style.background = '#222';
            RoomsCallSocket.receiveRemotePeer({ stream, id: uid });
          };
          // remoteEl.srcObject = stream;
        }
        RoomsCallSocket.receiveRemotePeer({ stream, id: uid });

        stream.onaddtrack = () => {};
        track.onended = () => {};
        track.onmute = () => {
          // remoteEl.srcObject = null;
          // remoteEl.style.background = '#222';
        };
        track.onunmute = () => {};
      };
    }
    return peerConnection;
  }
  addPeople({ cb, UIDs }: { cb: () => void; UIDs: string[] }) {
    RoomsCallSocket.instanceSocket.emit('addPeople', { UIDs });
    RoomsCallSocket.cbAddPeople = cb;
  }
}
