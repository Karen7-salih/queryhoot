/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from "react";
import { ably, roomChannelName } from "./ably";
import type { RealtimeMsg } from "./game";

export function useRoomChannel(roomCode: string | null, onMsg: (msg: RealtimeMsg) => void) {
  const channel = useMemo(() => {
    if (!roomCode) return null;
    return ably.channels.get(roomChannelName(roomCode));
  }, [roomCode]);

  useEffect(() => {
    if (!channel) return;

    const handler = (m: any) => {
      onMsg(m.data as RealtimeMsg);
    };

    channel.subscribe("msg", handler);

    return () => {
      channel.unsubscribe("msg", handler);
    };
  }, [channel, onMsg]);

  function publish(msg: RealtimeMsg) {
    if (!channel) return;
    channel.publish("msg", msg);
  }

  return { channel, publish };
}
