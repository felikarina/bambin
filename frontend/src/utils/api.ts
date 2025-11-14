// With HttpOnly cookie authentication the client cannot read the token.
// All requests should include credentials so the server can read the cookie.
export function getRoleHeader(): HeadersInit {
  // Legacy header support removed: server should read role from token cookie.
  return {};
}

export interface User {
  idUser?: string;
  firstname?: string;
  lastname?: string;
  role?: string;
  email?: string;
}

export async function fetchUsers(): Promise<User[]> {
  // Server handles role via token cookie. Include credentials on the request.
  const response = await fetch("/api/users", { credentials: "include" });
  if (!response.ok) throw new Error("Erreur lors du fetch des utilisateurs");
  return (await response.json()) as User[];
}

export async function addUserApi(newUser: Partial<User>) {
  const response = await fetch("/api/users", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
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
    credentials: "include",
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

export async function resetUserPasswordApi(idUser: string) {
  const response = await fetch(`/api/users?id=${idUser}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "resetPassword" }),
  });
  if (!response.ok) {
    let err;
    try {
      err = await response.json();
    } catch {
      err = {};
    }
    if (typeof err === "object" && err && "error" in err) {
      throw new Error(
        (err as { error?: string }).error ||
          "Erreur lors de la réinitialisation du mot de passe"
      );
    }
    throw new Error("Erreur lors de la réinitialisation du mot de passe");
  }
  return response.json() as Promise<{ initialPassword: string }>;
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
  const response = await fetch("/api/activities", { credentials: "include" });
  if (!response.ok) throw new Error("Erreur lors du fetch des activités");
  return (await response.json()) as Activity[];
}

export async function addActivityApi(newActivity: Partial<Activity>) {
  const response = await fetch("/api/activities", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
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
    credentials: "include",
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

export async function updateActivityApi(
  idActivity: string | number,
  updated: Partial<Activity> & { section?: string }
) {
  const response = await fetch(`/api/activities?id=${idActivity}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });
  if (!response.ok) {
    let err;
    try {
      err = await response.json();
    } catch {
      err = {};
    }
    if (typeof err === "object" && err && "error" in err) {
      throw new Error(
        (err as { error?: string }).error ||
          "Erreur lors de la modification de l'activité"
      );
    }
    throw new Error("Erreur lors de la modification de l'activité");
  }
  return response.json();
}

export interface Picture {
  idPicture?: string;
  date?: string;
  media?: string;
  title?: string;
  userId?: string;
}

export interface Child {
  idChild?: string;
  firstname?: string;
  lastname?: string;
  birthDate?: string;
  userId?: string;
  userId2?: string;
}

export async function fetchPictures(): Promise<Picture[]> {
  const response = await fetch("/api/pictures", {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Erreur lors du fetch des images");
  return (await response.json()) as Picture[];
}

export async function deletePictureApi(idPicture: string) {
  const response = await fetch(`/api/pictures?id=${idPicture}`, {
    method: "DELETE",
    credentials: "include",
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
    credentials: "include",
    headers: { "Content-Type": "application/json" },
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

export async function addPictureTagsApi(idPicture: string, childIds: string[]) {
  const response = await fetch("/api/picture-tags", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idPicture, childIds }),
  });
  if (!response.ok) {
    const err = await response.json();
    if (typeof err === "object" && err && "error" in err) {
      throw new Error(
        (err as { error?: string }).error || "Error while creating picture tags"
      );
    }
    throw new Error("Error while creating picture tags");
  }
  return response.json();
}

export async function fetchChildren(): Promise<Child[]> {
  const response = await fetch("/api/children", { credentials: "include" });
  if (!response.ok) throw new Error("Erreur lors du fetch des enfants");
  return (await response.json()) as Child[];
}

export async function addChildApi(newChild: Partial<Child>) {
  const response = await fetch("/api/children", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newChild),
  });
  if (!response.ok) {
    const err = await response.json();
    if (typeof err === "object" && err && "error" in err) {
      throw new Error(
        (err as { error?: string }).error ||
          "Erreur lors de l'ajout de l'enfant"
      );
    }
    throw new Error("Erreur lors de l'ajout de l'enfant");
  }
  return response.json();
}

export async function deleteChildApi(idChild: string) {
  const response = await fetch(`/api/children?id=${idChild}`, {
    method: "DELETE",
    credentials: "include",
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

export interface Section {
  idSection?: string;
  name?: string;
  year?: number;
  numberOfChild?: number;
}

export interface ChildSection {
  idChildSection?: string;
  childId?: string;
  sectionId?: string;
  sectionName?: string;
}

export async function fetchSections(): Promise<Section[]> {
  const response = await fetch("/api/sections", { credentials: "include" });
  if (!response.ok) throw new Error("Erreur lors du fetch des sections");
  return (await response.json()) as Section[];
}

export async function addChildSectionApi(
  newChildSection: Partial<ChildSection>
) {
  const response = await fetch("/api/child-sections", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      childId: newChildSection.childId,
      sectionName: newChildSection.sectionName,
    }),
  });
  if (!response.ok) {
    const err = await response.json();
    if (typeof err === "object" && err && "error" in err) {
      throw new Error(
        (err as { error?: string }).error ||
          "Erreur lors de l'association enfant-section"
      );
    }
    throw new Error("Erreur lors de l'association enfant-section");
  }
  return response.json();
}

export async function fetchChildSections(): Promise<ChildSection[]> {
  const response = await fetch("/api/child-sections", {
    credentials: "include",
  });
  if (!response.ok)
    throw new Error("Erreur lors du fetch des associations enfant-section");
  return (await response.json()) as ChildSection[];
}

export interface SectionActivity {
  idSectionActivity?: string;
  sectionId?: string;
  activityId?: string;
}

export async function fetchSectionActivities(): Promise<SectionActivity[]> {
  const response = await fetch("/api/section-activities", {
    credentials: "include",
  });
  if (!response.ok)
    throw new Error("Erreur lors du fetch des associations activité-section");
  return (await response.json()) as SectionActivity[];
}
