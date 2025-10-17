import { jwtDecode } from "jwt-decode";

export function getRole(): string {
  let role = "";
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token) as { role?: string };
      role = decoded.role ?? "";
    } catch (e) {
      role = "";
    }
  }

  if (!role) {
    role = localStorage.getItem("role") ?? "";
  }

  return role;
}

export function getUserId(): string {
  let userId = "";
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token) as { id?: string };
      userId = decoded.id ?? "";
    } catch (e) {
      userId = "";
    }
  }

  if (!userId) {
    userId = localStorage.getItem("userId") ?? "";
  }

  return userId;
}

export function isDemo(): boolean {
  return getRole() === "demo";
}

export function isAuthenticated(): boolean {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    jwtDecode(token);
    return true;
  } catch (e) {
    return false;
  }
}
