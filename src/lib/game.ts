export type Round = 1 | 2;

export type RoomState = {
  roomCode: string;
  round: Round;
  serverEpochMs: number;
  playerCount: number;
  version: number;
  refreshOwnerId: string | null;
  refreshedPlayerIds: string[]; 
};

export type PlayerSnapshot = {
  playerId: string;
  displayEpochMs: number;
  syncedVersion: number;
  round: Round;
  sentAtMs: number;
};

export type RealtimeMsg =
  | { type: "JOIN"; payload: { playerId: string } }
  | { type: "STATE"; payload: RoomState }
  | { type: "PLAYER_SNAPSHOT"; payload: PlayerSnapshot }
  | { type: "REFRESH_USED"; payload: { playerId: string } }
  | { type: "SET_ROUND"; payload: { round: Round } };




export function generateRoomCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); 
}


export function formatTime(ms: number) {
  const d = new Date(ms);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}
