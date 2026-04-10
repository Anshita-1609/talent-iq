import { useMemo, useState } from "react";
import { MessageSquareIcon, UsersIcon, VideoIcon } from "lucide-react";

function DummyVideoCallUI({ session, isHost, isParticipant }) {
  const [messages, setMessages] = useState([
    { id: 1, user: session?.host?.name || "Host", text: "Welcome to the session!" },
    { id: 2, user: "System", text: "This is a dummy video call placeholder." },
  ]);
  const [messageText, setMessageText] = useState("");

  const participantLabel = useMemo(() => {
    if (session?.participant) return session.participant.name;
    return isHost ? "Waiting for participant..." : "Joining soon...";
  }, [session, isHost]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    setMessages((current) => [
      ...current,
      { id: Date.now(), user: "You", text: messageText.trim() },
    ]);
    setMessageText("");
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="rounded-3xl bg-base-100 border border-base-300 p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <VideoIcon className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Dummy Video Call</h2>
            <p className="text-sm text-base-content/60">
              A simulated call is active for this session.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-base-200 h-40 flex flex-col items-center justify-center text-center p-4">
            <div className="mb-2 text-base-content/70">Host</div>
            <div className="text-lg font-semibold">{session?.host?.name || "Host"}</div>
          </div>
          <div className="rounded-2xl bg-base-200 h-40 flex flex-col items-center justify-center text-center p-4">
            <div className="mb-2 text-base-content/70">Participant</div>
            <div className="text-lg font-semibold">{participantLabel}</div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-base-300 border border-base-300 h-full overflow-hidden shadow-sm">
        <div className="h-64 bg-neutral/10 flex items-center justify-center text-center p-6">
          <div>
            <div className="mb-4 text-3xl">🎥</div>
            <p className="text-base-content/70">
              Dummy video feed is displayed here. Use this placeholder when the real video service is unavailable.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-base-100 border border-base-300 p-4 shadow-sm flex flex-col h-72">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquareIcon className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Session Chat</h3>
        </div>
        <div className="flex-1 overflow-y-auto mb-4 space-y-3">
          {messages.map((message) => (
            <div key={message.id} className="rounded-2xl bg-base-200 p-3">
              <div className="text-xs text-base-content/60 mb-1">{message.user}</div>
              <div className="text-sm">{message.text}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="input input-bordered flex-1"
          />
          <button onClick={handleSendMessage} className="btn btn-primary">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default DummyVideoCallUI;