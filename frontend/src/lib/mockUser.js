import { MOCK_USERS } from "../data/mockUsers";

/** Maps legacy demo ids (user_001) to clerkIds used by the backend */
const LEGACY_ID_TO_CLERK = {
  user_001: "user_2abc123def456",
  user_002: "user_2def456ghi789",
  user_003: "user_2ghi789jkl012",
};

export function getClerkIdForAuth(user) {
  if (!user) return null;
  const raw = user.clerkId || user.id;
  return LEGACY_ID_TO_CLERK[raw] || raw;
}

export function normalizeMockUser(stored) {
  if (!stored) return null;

  const clerkId = getClerkIdForAuth(stored);
  const profile = MOCK_USERS.find((u) => u.id === clerkId) || stored;

  return {
    id: clerkId,
    clerkId,
    name: profile.name || stored.name,
    email: profile.email || stored.email,
  };
}

export function isSameAppUser(sessionUser, currentUser) {
  if (!sessionUser || !currentUser) return false;
  const clerkId = getClerkIdForAuth(currentUser);
  if (sessionUser.clerkId === clerkId) return true;
  const internalId = Object.keys(LEGACY_ID_TO_CLERK).find(
    (key) => LEGACY_ID_TO_CLERK[key] === clerkId
  );
  return sessionUser.id === internalId || sessionUser.id === clerkId;
}

export function formatDifficulty(difficulty) {
  if (!difficulty || typeof difficulty !== "string") return "Easy";
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}
