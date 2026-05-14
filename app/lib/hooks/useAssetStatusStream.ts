import { useEffect, useRef } from "react";
import { useAuthStore } from "@/app/lib/stores/authStore";

type AssetStatusEvent = {
  assetId: string;
  status: "completed" | "failed";
};

type Listener = (event: AssetStatusEvent) => void;

/**
 * Opens a single SSE connection to the asset-status stream.
 * Calls `onEvent` whenever an asset's status changes.
 * Automatically reconnects on error.
 */
export function useAssetStatusStream(onEvent: Listener) {
  const token = useAuthStore((s) => s.token);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    if (!token) return;

    const apiHost = process.env.NEXT_PUBLIC_API_HOST;
    if (!apiHost) return;

    const url = `${apiHost}/api/assets/events/status?token=${encodeURIComponent(token)}`;
    let es: EventSource | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let closed = false;

    const connect = () => {
      if (closed) return;
      es = new EventSource(url);

      es.onmessage = (msg) => {
        try {
          const data: AssetStatusEvent = JSON.parse(msg.data);
          onEventRef.current(data);
        } catch {
          // ignore malformed
        }
      };

      es.onerror = () => {
        es?.close();
        if (!closed) {
          reconnectTimer = setTimeout(connect, 5000);
        }
      };
    };

    connect();

    return () => {
      closed = true;
      es?.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [token]);
}
