import { useEffect, useState } from "react";

export default function useEventSource<T>(
  url: string,
  onMessage: (message: T) => void
) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const sse = new EventSource(url, { withCredentials: true });
    sse.onopen = () => {
      setConnected(true);
    };
    sse.onmessage = (message) => {
      const data = JSON.parse(message.data);
      onMessage(data);
    };
    sse.onerror = (e) => {
      setConnected(false);
      console.log("error in opening conn.", e);
    };
    return () => {
      sse.close();
    };
  }, [url, onMessage]);

  return {
    connected,
  };
}
