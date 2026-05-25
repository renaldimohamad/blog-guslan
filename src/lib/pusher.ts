import Pusher from "pusher";
import PusherClient from "pusher-js";

const appId = process.env.PUSHER_APP_ID || "";
const key = process.env.NEXT_PUBLIC_PUSHER_KEY || "";
const secret = process.env.PUSHER_SECRET || "";
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap1";

export const hasPusherCredentials = !!(appId && key && secret);

// Server-side Pusher instance
export const pusherServer = new Pusher({
  appId,
  key,
  secret,
  cluster,
  useTLS: true,
});

// Client-side Pusher instance (lazy-loaded or instantiated on client)
let globalPusherClient: PusherClient | null = null;

export const getPusherClient = (): PusherClient | null => {
  if (typeof window === "undefined") return null;
  if (!key) {
    console.warn("Pusher client key is missing. Realtime features will be disabled.");
    return null;
  }
  
  if (!globalPusherClient) {
    globalPusherClient = new PusherClient(key, {
      cluster,
      forceTLS: true,
    });
  }
  
  return globalPusherClient;
};
