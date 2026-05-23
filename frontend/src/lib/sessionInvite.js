export function getSessionInviteUrl(sessionId) {
  if (!sessionId) return "";
  const origin = window.location.origin;
  return `${origin}/join/${sessionId}`;
}
