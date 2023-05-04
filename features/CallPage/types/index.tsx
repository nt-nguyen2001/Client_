export enum typeRoomE {
  'P' = 1,
  'G',
}
export type Peer = { stream: MediaStream; id: string; isDirty: boolean };
