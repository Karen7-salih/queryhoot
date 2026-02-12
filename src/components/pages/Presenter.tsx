import { useCallback, useEffect, useMemo, useState } from "react";
import {
  generateRoomCode,
  formatTime,
  type RoomState,
  type Round,
  type RealtimeMsg,
} from "../../lib/game";
import { useRoomChannel } from "../../lib/useRoomChannel";

export default function Presenter() {
  const [roomCode] = useState(() => generateRoomCode());

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

  const onMsg = useCallback((msg: RealtimeMsg) => {
    if (msg.type === "JOIN") {
      setState((prev) => ({
        ...prev,
        playerCount: prev.playerCount + 1,
        version: prev.version + 1,
      }));
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

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // keep simple: no toast yet
      alert("Copied!");
    } catch {
      alert("Copy failed. Copy manually.");
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h2>Presenter</h2>

      <div style={{ marginTop: 12, padding: 12, border: "1px solid #ddd" }}>
        <div style={{ fontSize: 14, opacity: 0.8 }}>Room Code</div>
        <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: 2 }}>
          {roomCode}
        </div>

        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 14, opacity: 0.8 }}>Join Link</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              style={{ padding: 10, minWidth: 320 }}
              value={joinUrl}
              readOnly
            />
            <button onClick={() => copy(joinUrl)}>Copy link</button>
            <button onClick={() => copy(roomCode)}>Copy code</button>
          </div>
        </div>

        <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ padding: 10, border: "1px solid #eee" }}>
            <div style={{ fontSize: 13, opacity: 0.8 }}>Players</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>
              {state.playerCount}
            </div>
          </div>

          <div style={{ padding: 10, border: "1px solid #eee" }}>
            <div style={{ fontSize: 13, opacity: 0.8 }}>Round</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{state.round}</div>
          </div>

          <div style={{ padding: 10, border: "1px solid #eee" }}>
            <div style={{ fontSize: 13, opacity: 0.8 }}>Server Time</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>
              {formatTime(state.serverEpochMs)}
            </div>
          </div>

          <div style={{ padding: 10, border: "1px solid #eee" }}>
            <div style={{ fontSize: 13, opacity: 0.8 }}>Version</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{state.version}</div>
          </div>
        </div>
      </div>

      <h3 style={{ marginTop: 18 }}>Controls</h3>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={() => setRound(1)}>Round 1 (Manual)</button>
        <button onClick={() => setRound(2)}>Round 2 (Auto)</button>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={() => adjustTime(-30_000)}>-30s</button>
        <button onClick={() => adjustTime(30_000)}>+30s</button>
        <button onClick={() => adjustTime(-5 * 60_000)}>-5m</button>
        <button onClick={() => adjustTime(5 * 60_000)}>+5m</button>
        <button onClick={randomJump}>Random jump</button>
        <button onClick={resetToNow}>Reset to now</button>
      </div>

      <p style={{ marginTop: 14, opacity: 0.75 }}>
        Next: Player will join using room code, receive STATE, and in Round 1 they
        must press Refresh to update. In Round 2 it updates automatically.
      </p>
    </div>
  );
}
