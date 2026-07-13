import { auth } from "@/lib/firebase";

export interface PunditTurn {
  role: "user" | "assistant";
  content: string;
}

export interface PunditStreamCallbacks {
  onStart?: (model: string) => void;
  onDelta: (delta: string) => void;
  onComplete?: (content: string) => void;
  onError: (message: string) => void;
}

export class PunditStreamError extends Error {}

interface SseFrame {
  event: string;
  data: string;
}

function parseFrame(raw: string): SseFrame | null {
  let event = "message";
  const dataLines: string[] = [];

  for (const line of raw.split("\n")) {
    if (line.startsWith("event:")) {
      event = line.slice("event:".length).trim();
    } else if (line.startsWith("data:")) {
      dataLines.push(line.slice("data:".length).trimStart());
    }
  }

  if (dataLines.length === 0) return null;
  return { event, data: dataLines.join("\n") };
}

/**
 * POST the conversation to /client/pundit and stream the SSE reply.
 * The conversation MUST end with a user turn (the backend rejects otherwise).
 */
export async function streamPunditResponse(
  fixtureIds: string[],
  conversation: PunditTurn[],
  callbacks: PunditStreamCallbacks,
  signal?: AbortSignal,
): Promise<void> {
  const token = await auth.currentUser?.getIdToken();
  if (!token) {
    throw new PunditStreamError("Not authenticated");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/client/pundit`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fixture_ids: fixtureIds,
        conversation,
      }),
      signal,
    },
  );

  if (!response.ok || !response.body) {
    let detail = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (typeof body?.detail === "string") detail = body.detail;
      else if (Array.isArray(body?.detail)) detail = "Invalid request";
    } catch {
      // non-JSON error body; keep the status-based message
    }
    throw new PunditStreamError(detail);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const handleFrame = (frame: SseFrame): boolean => {
    let payload: Record<string, unknown> = {};
    try {
      payload = JSON.parse(frame.data);
    } catch {
      return false;
    }

    switch (frame.event) {
      case "message_start":
        callbacks.onStart?.(String(payload.model ?? ""));
        return false;
      case "message_delta":
        if (typeof payload.delta === "string") callbacks.onDelta(payload.delta);
        return false;
      case "message_complete":
        if (typeof payload.content === "string")
          callbacks.onComplete?.(payload.content);
        return false;
      case "error":
        callbacks.onError(
          typeof payload.message === "string"
            ? payload.message
            : "The pundit hit a problem",
        );
        return false;
      case "done":
        return true;
      default:
        return false;
    }
  };

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    let sepIndex: number;
    while ((sepIndex = buffer.indexOf("\n\n")) !== -1) {
      const rawFrame = buffer.slice(0, sepIndex);
      buffer = buffer.slice(sepIndex + 2);
      const frame = parseFrame(rawFrame);
      if (frame && handleFrame(frame)) return;
    }
  }

  // flush any trailing frame without a terminating blank line
  if (buffer.trim()) {
    const frame = parseFrame(buffer);
    if (frame) handleFrame(frame);
  }
}
