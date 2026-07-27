export interface ApiError {
  /** Machine-readable backend code, when the response carries one. */
  code: string | null;
  /** Backend prose safe to show the punter, or null if the body had none. */
  message: string | null;
}

function detailOf(error: unknown): unknown {
  if (typeof error !== "object" || error === null) return undefined;
  // RTK Query wraps the parsed body in `data`; a raw fetch body is the body.
  const body = "data" in error ? (error as { data: unknown }).data : error;
  if (typeof body !== "object" || body === null) return undefined;
  return "detail" in body ? (body as { detail: unknown }).detail : undefined;
}

/**
 * Normalises a backend rejection into `{ code, message }`, tolerating both
 * `detail` shapes — the bare prose string and the `{ code, message }` object —
 * so the frontend can ship ahead of the backend. A 422's field-error array
 * yields nulls: it's no use to a punter, so callers supply their own copy.
 */
export function parseApiError(error: unknown): ApiError {
  const detail = detailOf(error);

  if (typeof detail === "string") {
    return { code: null, message: detail };
  }

  if (typeof detail === "object" && detail !== null && !Array.isArray(detail)) {
    const { code, message } = detail as { code?: unknown; message?: unknown };
    return {
      code: typeof code === "string" ? code : null,
      message: typeof message === "string" ? message : null,
    };
  }

  return { code: null, message: null };
}
