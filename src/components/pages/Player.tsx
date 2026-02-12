/* eslint-disable react-hooks/purity */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AnalogClock from "../clock/AnalogClock";
import type { RealtimeMsg, RoomState } from "../../lib/game";
import { formatTime } from "../../lib/game";
import { useRoomChannel } from "../../lib/useRoomChannel";
import { Users, RefreshCw, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
function getOrCreatePlayerId() {
  const key = "queryhoot_player_id";

  const existing = localStorage.getItem(key);
  if (existing) return existing;

  const id = crypto.randomUUID();
  localStorage.setItem(key, id);
  return id;
}

export default function Player() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const roomFromUrl = params.get("room");

  const [roomInput, setRoomInput] = useState(roomFromUrl ?? "");
  const [roomCode, setRoomCode] = useState<string | null>(roomFromUrl);

  const playerId = useMemo(() => getOrCreatePlayerId(), []);

  const [serverState, setServerState] = useState<RoomState | null>(null);

  // For Round 1 "manual refresh": we keep a "last fetched snapshot"
  const [manualSnapshot, setManualSnapshot] = useState<RoomState | null>(null);


const onMsg = useCallback((msg: RealtimeMsg) => {
  if (msg.type === "STATE") {
    setServerState(msg.payload);

    // Round 2: auto update snapshot immediately
    if (msg.payload.round === 2) {
      setManualSnapshot(msg.payload);
    }
  }
}, []);

  const { publish } = useRoomChannel(roomCode, onMsg);

  // When joining a room -> send JOIN
  useEffect(() => {
    if (!roomCode) return;
    publish({ type: "JOIN", payload: { playerId } });
  }, [roomCode, publish, playerId]);

  // If we just joined and got first serverState:
  // - Round 1: set snapshot only once (like "initial fetch")
  // - Round 2: snapshot already auto updates in onMsg
  useEffect(() => {
    if (!serverState) return;

    if (serverState.round === 1 && !manualSnapshot) {
      setManualSnapshot(serverState);
    }
  }, [serverState, manualSnapshot]);

  const joinRoom = () => {
    const cleaned = roomInput.trim();
    if (!cleaned) return;
    setRoomCode(cleaned);
    // reset local views for new room
    setServerState(null);
    setManualSnapshot(null);
  };

  const refresh = () => {
    if (!serverState) return;
    setManualSnapshot(serverState);
  };

  // What time do we show?
  const displayState = useMemo(() => {
    if (!serverState) return null;
    if (serverState.round === 2) return serverState; // auto
    return manualSnapshot; // Round 1 manual
  }, [serverState, manualSnapshot]);

  const timeMs = displayState?.serverEpochMs ?? Date.now();

  return (
    <div style={styles.container}>
    {!roomCode && (
  <>
    <button onClick={() => nav("/")} style={styles.backButtonJoin}>
      <ArrowLeft size={20} />
    </button>
    <div style={styles.joinContainer}>
      <div style={styles.logo}>QueryHoot</div>
      <h2 style={styles.joinTitle}>Join Game</h2>
      <input
        value={roomInput}
        onChange={(e) => setRoomInput(e.target.value)}
        placeholder="Game PIN"
        style={styles.input}
        maxLength={6}
        onKeyPress={(e) => e.key === 'Enter' && joinRoom()}
      />
      <button onClick={joinRoom} style={styles.joinButton}>
        Join
      </button>
    </div>
  </>
)}

      {roomCode && (
  <div style={styles.gameContainer}>
    {/* Back button */}
    <button onClick={() => nav("/")} style={styles.backButtonGame}>
      <ArrowLeft size={18} />
      <span>Home</span>
    </button>
    
    {/* Top bar with room info */}
    <div style={styles.topBar}>
            <div style={styles.roomBadge}>
              <span style={styles.roomLabel}>PIN</span>
              <span style={styles.roomCode}>{roomCode}</span>
            </div>
            
            <div style={styles.roundBadge}>
              <span style={styles.roundLabel}>Round</span>
              <span style={styles.roundNumber}>{serverState?.round ?? "-"}</span>
            </div>
            
            <div style={styles.playersBadge}>
              <Users size={20} color="#333" />
              <span style={styles.playersCount}>{serverState?.playerCount ?? "-"}</span>
            </div>
          </div>

          {!serverState && (
            <div style={styles.waitingContainer}>
              <div style={styles.loadingSpinner}></div>
              <p style={styles.waitingText}>Waiting for game to start...</p>
            </div>
          )}

          {serverState && (
  <div style={styles.clockContainer}>
    {/* Refresh button for Round 1 */}
              {serverState.round === 1 && (
                <button onClick={refresh} style={styles.refreshButton}>
                  <RefreshCw size={18} style={{ marginRight: '8px' }} />
                  Refresh Time
                </button>
              )}

              {/* Clock display */}
              <div style={styles.clockWrapper}>
                <AnalogClock
                  hour={new Date(timeMs).getHours()}
                  minute={new Date(timeMs).getMinutes()}
                  second={new Date(timeMs).getSeconds()}
                />
              </div>

              {/* Digital time */}
              <div style={styles.digitalTime}>
                {formatTime(timeMs)}
              </div>
            </div>
          )}

          {/* Leave button at bottom */}
          <button
            onClick={() => {
              setRoomCode(null);
              setRoomInput("");
              setServerState(null);
              setManualSnapshot(null);
            }}
            style={styles.leaveButton}
          >
            Leave Game
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "system-ui, -apple-system, sans-serif",
    padding: "20px",
  },
  
  // Join screen styles
  joinContainer: {
    background: "white",
    borderRadius: "24px",
    padding: "48px 32px",
    maxWidth: "400px",
    width: "100%",
    textAlign: "center" as const,
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  logo: {
    fontSize: "42px",
    fontWeight: 900,
    color: "#46178f",
    marginBottom: "32px",
  },
  joinTitle: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#333",
    marginBottom: "24px",
  },
  input: {
    width: "100%",
    padding: "18px 24px",
    fontSize: "24px",
    fontWeight: 700,
    textAlign: "center" as const,
    border: "3px solid #e0e0e0",
    borderRadius: "12px",
    marginBottom: "24px",
    letterSpacing: "4px",
    transition: "all 0.2s",
    outline: "none",
  },
  joinButton: {
    width: "100%",
    padding: "18px",
    fontSize: "20px",
    fontWeight: 700,
    color: "white",
    background: "#46178f",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 4px 12px rgba(70, 23, 143, 0.4)",
  },
  
  // Game screen styles
  gameContainer: {
    background: "white",
    borderRadius: "24px",
    padding: "24px",
    maxWidth: "500px",
    width: "100%",
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column" as const,
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  
  topBar: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
    flexWrap: "wrap" as const,
  },
  
  roomBadge: {
    flex: 1,
    background: "#f5f5f5",
    borderRadius: "12px",
    padding: "12px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    minWidth: "100px",
  },
  roomLabel: {
    fontSize: "11px",
    fontWeight: 600,
    color: "#666",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },
  roomCode: {
    fontSize: "24px",
    fontWeight: 900,
    color: "#46178f",
    marginTop: "4px",
  },
  
  roundBadge: {
    background: "#f5f5f5",
    borderRadius: "12px",
    padding: "12px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    minWidth: "80px",
  },
  roundLabel: {
    fontSize: "11px",
    fontWeight: 600,
    color: "#666",
    textTransform: "uppercase" as const,
  },
  roundNumber: {
    fontSize: "28px",
    fontWeight: 900,
    color: "#333",
    marginTop: "4px",
  },
  
  playersBadge: {
    background: "#f5f5f5",
    borderRadius: "12px",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    minWidth: "80px",
    justifyContent: "center",
  },
  playersCount: {
    fontSize: "24px",
    fontWeight: 900,
    color: "#333",
  },
  
  waitingContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: "24px",
  },
  loadingSpinner: {
    width: "48px",
    height: "48px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #46178f",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  waitingText: {
    fontSize: "18px",
    color: "#666",
    fontWeight: 500,
  },
  
  clockContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    padding: "20px 0",
  },
  
  modeIndicator: {
    padding: "12px 24px",
    borderRadius: "24px",
    color: "white",
    fontWeight: 700,
    fontSize: "16px",
    textAlign: "center" as const,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  
  refreshButton: {
    padding: "14px 32px",
    fontSize: "18px",
    fontWeight: 700,
    color: "white",
    background: "#ffc107",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(255, 193, 7, 0.4)",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  
  clockWrapper: {
    marginTop: "12px",
    marginBottom: "12px",
  },
  
  digitalTime: {
    fontSize: "48px",
    fontWeight: 900,
    color: "#333",
    letterSpacing: "2px",
  },
  
  statusText: {
    fontSize: "16px",
    color: "#666",
    fontWeight: 500,
    textAlign: "center" as const,
  },
  
  leaveButton: {
    marginTop: "auto",
    padding: "14px",
    fontSize: "16px",
    fontWeight: 600,
    color: "#666",
    background: "#f5f5f5",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  backButtonJoin: {
  position: "fixed" as const,
  top: "20px",
  left: "20px",
  background: "rgba(255,255,255,0.2)",
  border: "2px solid rgba(255,255,255,0.3)",
  borderRadius: "12px",
  width: "48px",
  height: "48px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.2s",
  color: "white",
  zIndex: 10,
},

backButtonGame: {
  background: "#f5f5f5",
  border: "none",
  borderRadius: "12px",
  padding: "10px 16px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
  transition: "all 0.2s",
  color: "#666",
  fontSize: "14px",
  fontWeight: 600,
  marginBottom: "16px",
  alignSelf: "flex-start",
},
};