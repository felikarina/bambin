// With HttpOnly token cookies the client cannot read the token directly.
// Provide async helpers that query the server for the current user information.

export type CurrentUser = { role?: string | null; userId?: string | null };

let cachedCurrentUser: CurrentUser | null = null;

export async function fetchCurrentUser(): Promise<CurrentUser> {
  try {
    const res = await fetch("/api/current-user", { credentials: "include" });
    const data = res.ok
      ? ((await res.json()) as CurrentUser)
      : { role: null, userId: null };
    cachedCurrentUser = data;
    return data;
  } catch (e) {
    cachedCurrentUser = { role: null, userId: null };
    return cachedCurrentUser;
  }
}

export function getRole(): string {
  return cachedCurrentUser?.role || "";
}

export function getUserId(): string {
  return cachedCurrentUser?.userId || "";
}

export function isDemo(): boolean {
  return getRole() === "demo";
}

export function isAuthenticated(): boolean {
  // Consider authenticated if the cache has a non-null userId or role.
  return !!(
    cachedCurrentUser &&
    (cachedCurrentUser.userId || cachedCurrentUser.role)
  );
}
