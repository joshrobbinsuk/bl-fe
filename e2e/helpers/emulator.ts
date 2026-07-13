const EMULATOR_HOST = "http://localhost:9099";
const PROJECT_ID = "demo-brokelads";
const API_KEY = "fake-api-key";

interface OobCode {
  email: string;
  requestType: string;
  oobCode: string;
}

export async function emulatorReachable(): Promise<boolean> {
  try {
    const res = await fetch(
      `${EMULATOR_HOST}/emulator/v1/projects/${PROJECT_ID}/config`,
    );
    return res.ok;
  } catch {
    return false;
  }
}

/** Create the e2e user in the Auth emulator; a no-op if it already exists. */
export async function ensureE2eUser(
  email: string,
  password: string,
): Promise<void> {
  const res = await fetch(
    `${EMULATOR_HOST}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    },
  );
  if (res.ok) return;
  const body = await res.json().catch(() => ({}));
  const message: string = body?.error?.message ?? "";
  if (message.includes("EMAIL_EXISTS")) return;
  throw new Error(`emulator signUp failed: ${message || res.status}`);
}

/** Latest resetPassword oobCode the emulator holds for this email, if any. */
export async function getResetOobCode(email: string): Promise<string | null> {
  const res = await fetch(
    `${EMULATOR_HOST}/emulator/v1/projects/${PROJECT_ID}/oobCodes`,
  );
  const body = (await res.json()) as { oobCodes?: OobCode[] };
  const match = (body.oobCodes ?? [])
    .filter((c) => c.email === email && c.requestType === "PASSWORD_RESET")
    .pop();
  return match?.oobCode ?? null;
}
