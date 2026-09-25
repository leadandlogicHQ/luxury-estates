"use client";

import { useEffect, useRef } from "react";

export default function ViewTracker({ id }: { id: string }) {
  const sent = useRef(false);

  useEffect(() => {
    /* Guards dev StrictMode double-mount; analytics never surface errors */
    if (sent.current) return;
    sent.current = true;
    fetch(`/api/views?id=${id}`, { method: "POST", keepalive: true }).catch(() => {});
  }, [id]);

  return null;
}