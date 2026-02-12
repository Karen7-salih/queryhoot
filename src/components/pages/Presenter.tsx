/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import {
  generateRoomCode,
  formatTime,
  type RoomState,
  type Round,
  type RealtimeMsg,
} from "../../lib/game";
import { useRoomChannel } from "../../lib/useRoomChannel";
import { Users, Copy, Link2, Clock, Hash, Pause, Zap, Plus, Minus, Shuffle, RotateCcw, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Presenter() {
  const [roomCode] = useState(() => generateRoomCode());
  const nav = useNavigate();

  const joinUrl = useMemo(() => {
    const base = window.location.origin;
    return `${base}/player?room=${roomCode}`;
  }, [roomCode]);

  const [state, setState] = useState<RoomState>(() => ({
    roomCode,
    round: 1,
    serverEpochMs: Date.now(),
    playerCount: 0,
    version: 1,
  }));

  const [copied, setCopied] = useState<string | null>(null);

  const playerIdsRef = useRef<Set<string>>(new Set());

const onMsg = useCallback((msg: RealtimeMsg) => {
  if (msg.type === "JOIN") {
    const { playerId } = msg.payload;
    if (!playerIdsRef.current.has(playerId)) {
      playerIdsRef.current.add(playerId);
      setState((prevState) => ({
        ...prevState,
        playerCount: playerIdsRef.current.size,
        version: prevState.version + 1,
      }));
    }
  }
}, []);

  const { publish } = useRoomChannel(roomCode, onMsg);

  // Broadcast current state on every change
  useEffect(() => {
    publish({ type: "STATE", payload: state });
  }, [state, publish]);

  // Helpers
  const setRound = (round: Round) => {
    setState((prev) => ({
      ...prev,
      round,
      version: prev.version + 1,
    }));
  };

  const adjustTime = (deltaMs: number) => {
    setState((prev) => ({
      ...prev,
      serverEpochMs: prev.serverEpochMs + deltaMs,
      version: prev.version + 1,
    }));
  };

  const randomJump = () => {
    // random jump between -5 minutes and +5 minutes
    const delta = Math.floor((Math.random() * 10 - 5) * 60_000);
    adjustTime(delta);
  };

  const resetToNow = () => {
    setState((prev) => ({
      ...prev,
      serverEpochMs: Date.now(),
      version: prev.version + 1,
    }));
  };

  const copy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      alert("Copy failed. Copy manually.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainCard}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => nav("/")} style={styles.backButton}>
              <ArrowLeft size={20} />
            </button>
            <h1 style={styles.title}>QueryHoot Presenter</h1>
          </div>
          <div style={styles.statusBadge}>
            <div style={styles.statusDot}></div>
            <span>Live</span>
          </div>
        </div>

        {/* Room Code Section */}
        <div style={styles.roomSection}>
          <div style={styles.roomCodeContainer}>
            <span style={styles.roomLabel}>Game PIN</span>
            <div style={styles.roomCodeDisplay}>{roomCode}</div>
            <button
              onClick={() => copy(roomCode, 'code')}
              style={styles.copyIconButton}
              title="Copy PIN"
            >
              <Copy size={20} />
              {copied === 'code' && <span style={styles.copiedText}>Copied!</span>}
            </button>
          </div>

          <div style={styles.joinLinkContainer}>
            <div style={styles.joinLinkLabel}>
              <Link2 size={16} />
              <span>Join Link</span>
            </div>
            <div style={styles.joinLinkBox}>
              <input
                style={styles.linkInput}
                value={joinUrl}
                readOnly
              />
              <button
                onClick={() => copy(joinUrl, 'link')}
                style={styles.copyButton}
              >
                <Copy size={16} />
                {copied === 'link' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <Users size={24} color="#46178f" />
            <div style={styles.statValue}>{state.playerCount}</div>
            <div style={styles.statLabel}>Players</div>
          </div>

          <div style={styles.statCard}>
            <Hash size={24} color="#46178f" />
            <div style={styles.statValue}>{state.round}</div>
            <div style={styles.statLabel}>Round</div>
          </div>

          <div style={styles.statCard}>
            <Clock size={24} color="#46178f" />
            <div style={styles.statValue}>{formatTime(state.serverEpochMs)}</div>
            <div style={styles.statLabel}>Server Time</div>
          </div>

          <div style={styles.statCard}>
            <Hash size={24} color="#46178f" />
            <div style={styles.statValue}>{state.version}</div>
            <div style={styles.statLabel}>Version</div>
          </div>
        </div>

        {/* Round Controls */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Round Controls</h3>
          <div style={styles.roundButtons}>
            <button
              onClick={() => setRound(1)}
              style={{
                ...styles.roundButton,
                ...(state.round === 1 ? styles.roundButtonActive : {}),
                backgroundColor: state.round === 1 ? "#ffc107" : "#f5f5f5",
                color: state.round === 1 ? "white" : "#333",
              }}
            >
              <Pause size={18} />
              <span>Round 1 (Manual)</span>
            </button>
            <button
              onClick={() => setRound(2)}
              style={{
                ...styles.roundButton,
                ...(state.round === 2 ? styles.roundButtonActive : {}),
                backgroundColor: state.round === 2 ? "#46178f" : "#f5f5f5",
                color: state.round === 2 ? "white" : "#333",
              }}
            >
              <Zap size={18} />
              <span>Round 2 (Auto)</span>
            </button>
          </div>
        </div>

        {/* Time Controls */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Time Controls</h3>
          <div style={styles.timeControls}>
            <button onClick={() => adjustTime(-30_000)} style={styles.timeButton}>
              <Minus size={16} />
              30s
            </button>
            <button onClick={() => adjustTime(30_000)} style={styles.timeButton}>
              <Plus size={16} />
              30s
            </button>
            <button onClick={() => adjustTime(-5 * 60_000)} style={styles.timeButton}>
              <Minus size={16} />
              5m
            </button>
            <button onClick={() => adjustTime(5 * 60_000)} style={styles.timeButton}>
              <Plus size={16} />
              5m
            </button>
            <button onClick={randomJump} style={styles.specialButton}>
              <Shuffle size={16} />
              Random
            </button>
            <button onClick={resetToNow} style={styles.specialButton}>
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </div>

        {/* Info Footer */}
        <div style={styles.infoFooter}>
          <p style={styles.infoText}>
            Players will join using the PIN above. In Round 1, they must manually refresh to see time changes.
            In Round 2, updates appear automatically.
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "40px 20px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },

  mainCard: {
    maxWidth: "900px",
    margin: "0 auto",
    background: "white",
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    flexWrap: "wrap" as const,
    gap: "16px",
  },

  title: {
    fontSize: "32px",
    fontWeight: 900,
    color: "#46178f",
    margin: 0,
  },

  statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#4caf50",
    color: "white",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: 600,
  },

  statusDot: {
    width: "8px",
    height: "8px",
    background: "white",
    borderRadius: "50%",
    animation: "pulse 2s infinite",
  },

  roomSection: {
    background: "#f8f9fa",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "24px",
  },

  roomCodeContainer: {
    textAlign: "center" as const,
    marginBottom: "20px",
    position: "relative" as const,
  },

  roomLabel: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#666",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    display: "block",
    marginBottom: "8px",
  },

  roomCodeDisplay: {
    fontSize: "56px",
    fontWeight: 900,
    color: "#46178f",
    letterSpacing: "8px",
    marginBottom: "8px",
  },

  copyIconButton: {
    background: "#46178f",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s",
    position: "relative" as const,
  },

  copiedText: {
    fontSize: "12px",
    marginLeft: "4px",
  },

  joinLinkContainer: {
    marginTop: "20px",
  },

  joinLinkLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#666",
    marginBottom: "8px",
  },

  joinLinkBox: {
    display: "flex",
    gap: "8px",
  },

  linkInput: {
    flex: 1,
    padding: "12px 16px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "monospace",
    outline: "none",
  },

  copyButton: {
    background: "#46178f",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "12px 20px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.2s",
    whiteSpace: "nowrap" as const,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "16px",
    marginBottom: "32px",
  },

  statCard: {
    background: "#f8f9fa",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "8px",
  },

  statValue: {
    fontSize: "32px",
    fontWeight: 900,
    color: "#333",
  },

  statLabel: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#666",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },

  section: {
    marginBottom: "24px",
  },

  sectionTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#333",
    marginBottom: "16px",
  },

  roundButtons: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "12px",
  },

  roundButton: {
    padding: "16px 24px",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.2s",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },

  roundButtonActive: {
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    transform: "translateY(-2px)",
  },

  timeControls: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
    gap: "10px",
  },

  timeButton: {
    padding: "14px 16px",
    background: "#f5f5f5",
    border: "2px solid #e0e0e0",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 600,
    color: "#333",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    transition: "all 0.2s",
  },

  specialButton: {
    padding: "14px 16px",
    background: "#46178f",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 600,
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    transition: "all 0.2s",
    boxShadow: "0 2px 8px rgba(70, 23, 143, 0.3)",
  },

  infoFooter: {
    marginTop: "32px",
    padding: "16px",
    background: "#f0f4ff",
    borderRadius: "12px",
    borderLeft: "4px solid #46178f",
  },

  infoText: {
    margin: 0,
    fontSize: "14px",
    color: "#555",
    lineHeight: "1.6",
  },

  backButton: {
    background: "#f5f5f5",
    border: "none",
    borderRadius: "12px",
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s",
    color: "#46178f",
  },
};