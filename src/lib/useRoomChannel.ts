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

  // Track whether channel is attached
  const isAttachedRef = useRef(false);

  useEffect(() => {
    if (!channel) return;

    let cancelled = false;

    const handler = (m: any) => {
      onMsgRef.current(m.data as RealtimeMsg);
    };

    const attachAndSubscribe = async () => {
      try {
        // ✅ ensure channel is attached before subscribing
        await channel.attach();
        if (cancelled) return;

        isAttachedRef.current = true;
        channel.subscribe("msg", handler);
      } catch (err) {
        console.error("Failed to attach/subscribe to Ably channel", err);
      }
    };

    attachAndSubscribe();

    return () => {
      cancelled = true;
      isAttachedRef.current = false;
      try {
        channel.unsubscribe("msg", handler);
      } catch {
        // ignore
      }
    };
  }, [channel]);

  const publish = useCallback(
    (msg: RealtimeMsg) => {
      if (!channel) return;

      // ✅ prevent publish before attach (helps “same session” reliability)
      if (!isAttachedRef.current) {
        // quick retry (don’t block UI)
        channel.attach().then(() => {
          isAttachedRef.current = true;
          channel.publish("msg", msg);
        });
        return;
      }

      channel.publish("msg", msg);
    },
    [channel]
  );

  return { channel, publish };
}
