import { io, Socket } from 'socket.io-client';

class ClosedTabSocket {
  private static instance: Socket | undefined;
  private constructor() {}
  static getInstance() {
    if (ClosedTabSocket.instance === undefined) {
      this.instance = io(`${process.env.NEXT_PUBLIC_API_URL}/closedTabUser`, {
        withCredentials: true,
      });
    }
    return this.instance!;
  }
  static disconnectSocket() {
    if (ClosedTabSocket.instance) {
      ClosedTabSocket.instance.disconnect();
    }
    ClosedTabSocket.instance = undefined;
  }
  static sendURLImages(payload: { urls: string[]; max: number }) {
    if (ClosedTabSocket.instance) {
      ClosedTabSocket.instance.emit('images', payload);
    }
  }
  static Leave(payload: { urls: string[]; max: number }) {
    if (ClosedTabSocket.instance) {
      ClosedTabSocket.instance.emit('leave', payload);
    }
  }
}
export { ClosedTabSocket };
