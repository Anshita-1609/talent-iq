import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Code2Icon, Loader2Icon, UsersIcon } from "lucide-react";
import { useUser } from "../lib/mockAuth.jsx";
import { MOCK_USERS } from "../data/mockUsers";
import { getSessionInviteUrl } from "../lib/sessionInvite";
import { normalizeMockUser } from "../lib/mockUser";

const PENDING_JOIN_KEY = "pendingJoinSessionId";

function JoinSessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !id) return;
    if (isSignedIn) {
      sessionStorage.removeItem(PENDING_JOIN_KEY);
      navigate(`/session/${id}`, { replace: true });
    } else {
      sessionStorage.setItem(PENDING_JOIN_KEY, id);
    }
  }, [isLoaded, isSignedIn, id, navigate]);

  const signInAs = (user) => {
    localStorage.setItem("mockUser", JSON.stringify(normalizeMockUser(user)));
    sessionStorage.removeItem(PENDING_JOIN_KEY);
    window.location.href = `/session/${id}`;
  };

  if (!isLoaded || isSignedIn) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <Loader2Icon className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 flex items-center justify-center p-6">
      <div className="card bg-base-100 shadow-xl max-w-lg w-full border border-primary/20">
        <div className="card-body">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <UsersIcon className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Join coding session</h1>
              <p className="text-sm text-base-content/60">You were invited to a 1-on-1 room</p>
            </div>
          </div>

          <div className="alert alert-info text-sm">
            <Code2Icon className="size-4 shrink-0" />
            <span>Choose a demo account below, then you will enter the shared room automatically.</span>
          </div>

          <p className="text-sm font-medium mt-4 mb-2">Continue as:</p>
          <div className="space-y-2">
            {MOCK_USERS.map((user) => (
              <button
                key={user.id}
                type="button"
                className="btn btn-outline w-full justify-start gap-3"
                onClick={() => signInAs(user)}
              >
                <span className="font-semibold">{user.name}</span>
                <span className="text-xs opacity-60">{user.email}</span>
              </button>
            ))}
          </div>

          <p className="text-xs text-center text-base-content/50 mt-4 break-all">
            Room link: {getSessionInviteUrl(id)}
          </p>

          <div className="card-actions justify-center mt-2">
            <Link to="/" className="link link-primary text-sm">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export { PENDING_JOIN_KEY };
export default JoinSessionPage;
