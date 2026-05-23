import { useState } from "react";
import { CheckIcon, CopyIcon, LinkIcon } from "lucide-react";
import toast from "react-hot-toast";
import { getSessionInviteUrl } from "../lib/sessionInvite";

function SessionInviteLink({ sessionId, waitingForGuest = true }) {
  const [copied, setCopied] = useState(false);
  const inviteUrl = getSessionInviteUrl(sessionId);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast.success("Invite link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  };

  if (!sessionId) return null;

  return (
    <div className="mt-4 p-4 rounded-xl border border-primary/30 bg-primary/5">
      <div className="flex items-center gap-2 mb-2">
        <LinkIcon className="size-4 text-primary" />
        <p className="font-semibold text-sm">Invite a partner</p>
        {waitingForGuest && (
          <span className="badge badge-warning badge-sm">Waiting for guest</span>
        )}
      </div>
      <p className="text-xs text-base-content/60 mb-3">
        Share this link. They sign in, open the room, and join as the second participant (max 2).
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          readOnly
          value={inviteUrl}
          className="input input-bordered input-sm flex-1 font-mono text-xs"
        />
        <button type="button" className="btn btn-primary btn-sm gap-1" onClick={handleCopy}>
          {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

export default SessionInviteLink;
