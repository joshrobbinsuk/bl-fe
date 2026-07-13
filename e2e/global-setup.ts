import { config as loadEnv } from "dotenv";
import { emulatorReachable, ensureE2eUser } from "./helpers/emulator";

loadEnv({ path: ".env.e2e" });

// Seed the e2e user into the Auth emulator once per run. Idempotent, and a
// no-op when the emulator isn't up (the reset spec skips itself in that case).
export default async function globalSetup() {
  const email = process.env.E2E_TEST_EMAIL;
  const password = process.env.E2E_TEST_PASSWORD;
  if (!email || !password) return;
  if (!(await emulatorReachable())) {
    console.warn("[e2e] Auth emulator not reachable; skipping user seed.");
    return;
  }
  await ensureE2eUser(email, password);
}
