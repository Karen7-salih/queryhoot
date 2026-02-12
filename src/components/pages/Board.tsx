/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRoomChannel } from "../../lib/useRoomChannel";
import {
  formatTime,
  type PlayerSnapshot,
  type RealtimeMsg,
  type RoomState,
} from "../../lib/game";
import { ArrowLeft, Clock, Users, TriangleAlert, Activity } from "lucide-react";

type SnapshotMap = Record<string, PlayerSnapshot>;

function shortId(id: string) {
  return id.slice(0, 4).toUpperCase();
}

export default function Board() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const roomCode = params.get("room");

  const [serverState, setServerState] = useState<RoomState | null>(null);
  const [snapshots, setSnapshots] = useState<SnapshotMap>({});

  const onMsg = useCallback((msg: RealtimeMsg) => {
    if (msg.type === "STATE") {
      setServerState(msg.payload);
      return;
    }
    if (msg.type === "PLAYER_SNAPSHOT") {
      const p = msg.payload;
      setSnapshots((prev) => ({
        ...prev,
        [p.playerId]: p,
      }));
      return;
    }
  }, []);

  useRoomChannel(roomCode, onMsg);

  const players = useMemo(() => {
    return Object.values(snapshots).sort((a, b) => a.playerId.localeCompare(b.playerId));
  }, [snapshots]);

  const serverTimeText = serverState ? formatTime(serverState.serverEpochMs) : "--:--:--";

  return (
    <div style={styles.container}>
      <div style={styles.mainCard}>
        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => nav("/presenter")} style={styles.backButton}>
            <ArrowLeft size={20} />
            <span>Presenter</span>
          </button>

          <div style={styles.headerCenter}>
            <h1 style={styles.title}>QueryHoot Board</h1>
            <div style={styles.subTitle}>
              Live player times (manual chaos vs auto sync)
            </div>
          </div>

          <div style={styles.roomBadge}>
            <span style={styles.roomLabel}>PIN</span>
            <span style={styles.roomCode}>{roomCode ?? "—"}</span>
          </div>
        </div>

        {/* Top Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <Users size={20} color="#46178f" />
            <div style={styles.statValue}>{serverState?.playerCount ?? players.length}</div>
            <div style={styles.statLabel}>Players</div>
          </div>

          <div style={styles.statCard}>
            <Clock size={20} color="#46178f" />
            <div style={styles.statValue}>{serverTimeText}</div>
            <div style={styles.statLabel}>Server Time</div>
          </div>

          <div style={styles.statCard}>
            <Activity size={20} color="#46178f" />
            <div style={styles.statValue}>{serverState?.version ?? "-"}</div>
            <div style={styles.statLabel}>Version</div>
          </div>

          <div style={styles.statCard}>
            <TriangleAlert size={20} color="#46178f" />
            <div style={styles.statValue}>{serverState?.round ?? "-"}</div>
            <div style={styles.statLabel}>Round</div>
          </div>
        </div>

        {!roomCode && (
          <div style={styles.emptyState}>
            Missing room code. Open this page like:
            <div style={styles.mono}>/board?room=123456</div>
          </div>
        )}

        {roomCode && !serverState && (
          <div style={styles.emptyState}>
            Waiting for presenter state…
          </div>
        )}

        {/* Grid */}
        <div style={styles.grid}>
          {players.map((p, idx) => {
            const isSynced =
              serverState ? p.syncedVersion === serverState.version : true;

            const deltaSec = serverState
              ? Math.round((p.displayEpochMs - serverState.serverEpochMs) / 1000)
              : 0;

            const deltaLabel =
              deltaSec === 0 ? "Δ 0s" : deltaSec > 0 ? `Δ +${deltaSec}s` : `Δ ${deltaSec}s`;

            const badge =
              isSynced
                ? { text: "FRESH", bg: "#4caf50" }
                : { text: "STALE", bg: "#ff9800" };

            return (
              <div key={p.playerId} style={styles.playerCard}>
                <div style={styles.playerTop}>
                  <div style={styles.playerName}>
                    Player {idx + 1} <span style={styles.playerId}>({shortId(p.playerId)})</span>
                  </div>
                  <div style={{ ...styles.badge, background: badge.bg }}>
                    {badge.text}
                  </div>
                </div>

                <div style={styles.timeBig}>{formatTime(p.displayEpochMs)}</div>

                <div style={styles.metaRow}>
                  <div style={styles.metaChip}>{deltaLabel}</div>
                  <div style={styles.metaChip}>v{p.syncedVersion}</div>
                </div>

                <div style={styles.smallHint}>
                  {serverState?.round === 1
                    ? "Round 1: people refresh manually → times diverge."
                    : "Round 2: auto sync → all times converge."}
                </div>
              </div>
            );
          })}
        </div>

        {players.length === 0 && roomCode && (
          <div style={styles.emptyState}>
            No players yet. Ask them to join the game.
          </div>
        )}
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
    maxWidth: "1100px",
    margin: "0 auto",
    background: "white",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "18px",
    flexWrap: "wrap" as const,
  },

  backButton: {
    background: "#f5f5f5",
    border: "none",
    borderRadius: "12px",
    padding: "10px 14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    color: "#666",
    fontSize: "14px",
    fontWeight: 700,
  },

  headerCenter: {
    textAlign: "center" as const,
    flex: 1,
    minWidth: "280px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    fontWeight: 900,
    color: "#46178f",
  },

  subTitle: {
    marginTop: "6px",
    fontSize: "14px",
    color: "#666",
    fontWeight: 600,
  },

  roomBadge: {
    background: "#f5f5f5",
    borderRadius: "12px",
    padding: "10px 14px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    minWidth: "120px",
  },

  roomLabel: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#666",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },

  roomCode: {
    fontSize: "22px",
    fontWeight: 900,
    color: "#46178f",
    marginTop: "2px",
  },

  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "12px",
    marginBottom: "18px",
  },

  statCard: {
    background: "#f8f9fa",
    borderRadius: "14px",
    padding: "14px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  statValue: {
    fontSize: "20px",
    fontWeight: 900,
    color: "#333",
  },

  statLabel: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#666",
    textTransform: "uppercase" as const,
    letterSpacing: "0.4px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "14px",
    marginTop: "10px",
  },

  playerCard: {
    background: "#ffffff",
    border: "2px solid #f0f0f0",
    borderRadius: "18px",
    padding: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  },

  playerTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    marginBottom: "10px",
  },

  playerName: {
    fontSize: "14px",
    fontWeight: 900,
    color: "#333",
  },

  playerId: {
    fontWeight: 800,
    color: "#777",
  },

  badge: {
    padding: "6px 10px",
    borderRadius: "999px",
    color: "white",
    fontSize: "12px",
    fontWeight: 900,
    letterSpacing: "0.5px",
  },

  timeBig: {
    fontSize: "34px",
    fontWeight: 950,
    color: "#111",
    letterSpacing: "1px",
    marginBottom: "10px",
  },

  metaRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap" as const,
    marginBottom: "10px",
  },

  metaChip: {
    background: "#f5f5f5",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: 800,
    color: "#555",
  },

  smallHint: {
    fontSize: "12px",
    color: "#777",
    fontWeight: 600,
    lineHeight: "1.4",
  },

  emptyState: {
    background: "#f0f4ff",
    borderRadius: "16px",
    padding: "18px",
    fontWeight: 700,
    color: "#555",
    marginTop: "14px",
  },

  mono: {
    marginTop: "8px",
    fontFamily: "monospace",
    fontWeight: 900,
  },
};
