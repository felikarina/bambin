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

export async function addPictureTagsApi(idPicture: string, childIds: string[]) {
  const response = await fetch("/api/picture-tags", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getDemoRoleHeader() },
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
  const role = localStorage.getItem("role");
  if (role === "demo") return [];
  const headers = { ...getDemoRoleHeader() };
  const hasHeaders = Object.keys(headers).length > 0;
  const response = hasHeaders
    ? await fetch("/api/children", { headers })
    : await fetch("/api/children");
  if (!response.ok) throw new Error("Erreur lors du fetch des enfants");
  return (await response.json()) as Child[];
}

export async function addChildApi(newChild: Partial<Child>) {
  const response = await fetch("/api/children", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getDemoRoleHeader() },
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
  const role = localStorage.getItem("role");
  if (role === "demo") return [];
  const headers = { ...getDemoRoleHeader() };
  const hasHeaders = Object.keys(headers).length > 0;
  const response = hasHeaders
    ? await fetch("/api/sections", { headers })
    : await fetch("/api/sections");
  if (!response.ok) throw new Error("Erreur lors du fetch des sections");
  return (await response.json()) as Section[];
}

export async function addChildSectionApi(
  newChildSection: Partial<ChildSection>
) {
  const response = await fetch("/api/child-sections", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getDemoRoleHeader() },
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
  const role = localStorage.getItem("role");
  if (role === "demo") return [];
  const headers = { ...getDemoRoleHeader() };
  const hasHeaders = Object.keys(headers).length > 0;
  const response = hasHeaders
    ? await fetch("/api/child-sections", { headers })
    : await fetch("/api/child-sections");
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
  const headers = { ...getDemoRoleHeader() };
  const hasHeaders = Object.keys(headers).length > 0;
  const response = hasHeaders
    ? await fetch("/api/section-activities", { headers })
    : await fetch("/api/section-activities");
  if (!response.ok)
    throw new Error("Erreur lors du fetch des associations activité-section");
  return (await response.json()) as SectionActivity[];
}
