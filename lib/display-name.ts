/**
 * Derive a display name from an email address: the local-part with any `+tag`
 * stripped. e.g. `joshrobbinsukdev+test@gmail.com` -> `joshrobbinsukdev`.
 * Stopgap until real usernames exist.
 */
export function displayNameFromEmail(email: string): string {
  const localPart = email.split("@")[0];
  const withoutTag = localPart.split("+")[0];
  return withoutTag || email;
}
