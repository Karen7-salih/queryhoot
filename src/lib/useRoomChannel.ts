/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useRef } from "react";
import { ably, roomChannelName } from "./ably";
import type { RealtimeMsg } from "./game";

export function useRoomChannel(
  roomCode: string | null,
  onMsg: (msg: RealtimeMsg) => void
) {
  const channel = useMemo(() => {
    if (!roomCode) return null;
    return ably.channels.get(roomChannelName(roomCode));
  }, [roomCode]);

  const onMsgRef = useRef(onMsg);
  useEffect(() => {
    onMsgRef.current = onMsg;
  }, [onMsg]);

  useEffect(() => {
    if (!channel) return;

    const handler = (m: any) => {
      onMsgRef.current(m.data as RealtimeMsg);
    };

    channel.subscribe("msg", handler);

    return () => {
      channel.unsubscribe("msg", handler);
    };
  }, [channel]);

  const publish = useCallback(
    (msg: RealtimeMsg) => {
      if (!channel) return;
      channel.publish("msg", msg);
    },
    [channel]
  );

  return { channel, publish };
}
