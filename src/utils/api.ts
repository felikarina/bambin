export interface User {
  idUser?: string;
  firstname?: string;
  lastname?: string;
  role?: string;
  email?: string;
  password?: string;
}

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch("/api/users");
  if (!response.ok) throw new Error("Erreur lors du fetch des utilisateurs");
  return response.json();
}

export async function addUserApi(newUser: Partial<User>) {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Erreur lors de l'ajout");
  }
  return response.json();
}

export async function deleteUserApi(idUser: string) {
  const response = await fetch(`/api/users?id=${idUser}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const text = await response.text();
    let err;
    try {
      err = text ? JSON.parse(text) : {};
    } catch {
      err = {};
    }
    throw new Error(err.error || "Erreur lors de la suppression");
  }
  return;
}

export interface Activity {
  id_activity?: number;
  date?: string;
  title?: string;
  description?: string;
}

export async function fetchActivities(): Promise<Activity[]> {
  const response = await fetch("/api/activities");
  if (!response.ok) throw new Error("Erreur lors du fetch des activités");
  return response.json();
}
