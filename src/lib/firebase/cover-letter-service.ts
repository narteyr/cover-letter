/**
 * In-memory cover letter service for standalone mode (no Firebase).
 * Data is lost on page refresh. For persistence, integrate Firebase.
 */

export interface FirestoreCoverLetter {
  id: string;
  jobId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const store = new Map<string, Map<string, FirestoreCoverLetter>>();

function getUserStore(uid: string): Map<string, FirestoreCoverLetter> {
  if (!store.has(uid)) store.set(uid, new Map());
  return store.get(uid)!;
}

export async function createCoverLetter(
  uid: string,
  data: Omit<FirestoreCoverLetter, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const userStore = getUserStore(uid);
  const id = `cl-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const now = new Date().toISOString();
  userStore.set(id, {
    id,
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  return id;
}

export async function updateCoverLetter(
  uid: string,
  docId: string,
  data: Partial<Omit<FirestoreCoverLetter, "id" | "createdAt">>
): Promise<void> {
  const userStore = getUserStore(uid);
  const existing = userStore.get(docId);
  if (!existing) return;
  userStore.set(docId, {
    ...existing,
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function getCoverLetter(uid: string, docId: string): Promise<FirestoreCoverLetter | null> {
  const userStore = getUserStore(uid);
  return userStore.get(docId) ?? null;
}

export async function listCoverLetters(uid: string): Promise<FirestoreCoverLetter[]> {
  const userStore = getUserStore(uid);
  return Array.from(userStore.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function deleteCoverLetter(uid: string, docId: string): Promise<void> {
  const userStore = getUserStore(uid);
  userStore.delete(docId);
}
