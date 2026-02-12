export type Round = 1 | 2;

export type RoomState = {
  roomCode: string;
  round: Round;
  serverEpochMs: number; // “server time”
  playerCount: number;
};

export type RealtimeMessage =
  | { type: "ROOM_STATE"; payload: RoomState }
  | { type: "ROUND_SET"; payload: { round: Round } }
  | { type: "SERVER_TIME_SET"; payload: { serverEpochMs: number } }
  | { type: "PLAYER_JOINED"; payload: { playerCount: number } };
