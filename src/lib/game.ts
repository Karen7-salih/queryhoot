export type Round = 1 | 2;

export type RoomState = {
  roomCode: string;
  round: Round;
  serverEpochMs: number;   // the “server time”
  playerCount: number;
  version: number;         // increments on each server change
};

export type RealtimeMsg =
  | { type: "STATE"; payload: RoomState }
  | { type: "JOIN"; payload: { playerId: string } };

export function generateRoomCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
}

export function formatTime(ms: number) {
  const d = new Date(ms);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}
