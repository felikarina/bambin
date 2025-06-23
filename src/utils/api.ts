export function getDemoRoleHeader(): HeadersInit {
  const role = localStorage.getItem("role");
  return role ? { "x-user-role": role } : ({} as HeadersInit);
}

export interface User {
  idUser?: string;
  firstname?: string;
  lastname?: string;
  role?: string;
  email?: string;
  password?: string;
}

export async function fetchUsers(): Promise<User[]> {
  const role = localStorage.getItem("role");
  if (role === "demo") return [];
  const headers = { ...getDemoRoleHeader() };
  const hasHeaders = Object.keys(headers).length > 0;
  const response = hasHeaders
    ? await fetch("/api/users", { headers })
    : await fetch("/api/users");
  if (!response.ok) throw new Error("Erreur lors du fetch des utilisateurs");
  return (await response.json()) as User[];
}

export async function addUserApi(newUser: Partial<User>) {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getDemoRoleHeader() },
    body: JSON.stringify(newUser),
  });
  if (!response.ok) {
    const err = await response.json();
    if (typeof err === "object" && err && "error" in err) {
      throw new Error(
        (err as { error?: string }).error || "Erreur lors de l'ajout"
      );
    }
    throw new Error("Erreur lors de l'ajout");
  }
  return response.json();
}

export async function deleteUserApi(idUser: string) {
  const response = await fetch(`/api/users?id=${idUser}`, {
    method: "DELETE",
    headers: { ...getDemoRoleHeader() },
  });
  if (!response.ok) {
    const text = await response.text();
    let err;
    try {
      err = text ? JSON.parse(text) : {};
    } catch {
      err = {};
    }
    if (typeof err === "object" && err && "error" in err) {
      throw new Error(
        (err as { error?: string }).error || "Erreur lors de la suppression"
      );
    }
    throw new Error("Erreur lors de la suppression");
  }
  return;
}

export interface Activity {
  idActivity?: number;
  date?: string;
  title?: string;
  description?: string;
  category?: string;
  userId?: string;
}

export async function fetchActivities(): Promise<Activity[]> {
  const headers = { ...getDemoRoleHeader() };
  const hasHeaders = Object.keys(headers).length > 0;
  const response = hasHeaders
    ? await fetch("/api/activities", { headers })
    : await fetch("/api/activities");
  if (!response.ok) throw new Error("Erreur lors du fetch des activités");
  return (await response.json()) as Activity[];
}

export async function addActivityApi(newActivity: Partial<Activity>) {
  const response = await fetch("/api/activities", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getDemoRoleHeader() },
    body: JSON.stringify(newActivity),
  });
  if (!response.ok) {
    const err = await response.json();
    if (typeof err === "object" && err && "error" in err) {
      throw new Error(
        (err as { error?: string }).error ||
          "Erreur lors de l'ajout de l'activité"
      );
    }
    throw new Error("Erreur lors de l'ajout de l'activité");
  }
  return response.json();
}

export async function deleteActivityApi(idActivity: string) {
  const response = await fetch(`/api/activities?id=${idActivity}`, {
    method: "DELETE",
    headers: { ...getDemoRoleHeader() },
  });
  if (!response.ok) {
    const text = await response.text();
    let err;
    try {
      err = text ? JSON.parse(text) : {};
    } catch {
      err = {};
    }
    if (typeof err === "object" && err && "error" in err) {
      throw new Error(
        (err as { error?: string }).error || "Erreur lors de la suppression"
      );
    }
    throw new Error("Erreur lors de la suppression");
  }
  return;
}

export interface Picture {
  idPicture?: string;
  date?: string;
  media?: string;
  title?: string;
  userId?: string;
}

export async function fetchPictures(): Promise<Picture[]> {
  const response = await fetch("/api/pictures", {
    headers: { ...getDemoRoleHeader() },
  });
  if (!response.ok) throw new Error("Erreur lors du fetch des images");
  return (await response.json()) as Picture[];
}

export async function deletePictureApi(idPicture: string) {
  const response = await fetch(`/api/pictures?id=${idPicture}`, {
    method: "DELETE",
    headers: { ...getDemoRoleHeader() },
  });
  if (!response.ok) {
    const text = await response.text();
    let err;
    try {
      err = text ? JSON.parse(text) : {};
    } catch {
      err = {};
    }
    if (typeof err === "object" && err && "error" in err) {
      throw new Error(
        (err as { error?: string }).error || "Erreur lors de la suppression"
      );
    }
    throw new Error("Erreur lors de la suppression");
  }
  return;
}

export async function addPictureApi(newPicture: Partial<Picture>) {
  const response = await fetch("/api/pictures", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getDemoRoleHeader() },
    body: JSON.stringify(newPicture),
  });
  if (!response.ok) {
    const err = await response.json();
    if (typeof err === "object" && err && "error" in err) {
      throw new Error(
        (err as { error?: string }).error ||
          "Erreur lors de l'ajout de la photo"
      );
    }
    throw new Error("Erreur lors de l'ajout de la photo");
  }
  return response.json();
}
