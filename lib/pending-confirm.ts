const KEY = "pendingConfirmEmail";

export function getPendingConfirmEmail(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}

export function setPendingConfirmEmail(email: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, email);
}

export function clearPendingConfirmEmail(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
