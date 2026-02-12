import Ably from "ably";

const key = import.meta.env.VITE_ABLY_KEY as string | undefined;

if (!key) {
  console.warn("Missing VITE_ABLY_KEY in .env");
}

export const ably = new Ably.Realtime({ key });

export function roomChannelName(code: string) {
  return `queryhoot:room:${code}`;
}
