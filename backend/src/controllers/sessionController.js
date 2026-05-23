import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";
import User from "../models/User.js";

export async function createSession(req, res) {
  try {
    const { problem, difficulty } = req.body;
    const userId = req.user.id;
    const clerkId = req.user.clerkId;

    if (!problem || !difficulty) {
      return res.status(400).json({ message: "Problem and difficulty are required" });
    }

    // generate a unique call id for stream video
    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // create session in db
    const session = Session.create({ problem, difficulty, host: userId, callId });

    // create stream video call
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: { problem, difficulty, sessionId: session.id },
      },
    });

    // chat messaging
    const channel = chatClient.channel("messaging", callId, {
      name: `${problem} Session`,
      created_by_id: clerkId,
      members: [clerkId],
    });

    await channel.create();

    res.status(201).json({ session });
  } catch (error) {
    console.log("Error in createSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getActiveSessions(_, res) {
  try {
    const sessions = Session.find({ status: "active" });
    // Populate host and participant manually
    const populatedSessions = await Promise.all(
      sessions.map(async (session) => {
        const host = User.findOne({ id: session.host });
        const participant = session.participant ? User.findOne({ id: session.participant }) : null;
        return {
          ...session,
          host,
          participant,
        };
      })
    );
    res.status(200).json({ sessions: populatedSessions });
  } catch (error) {
    console.log("Error in getActiveSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyRecentSessions(req, res) {
  try {
    const userId = req.user.id;

    // get sessions where user is either host or participant
    const allSessions = Session.find({ status: "completed" });
    const sessions = allSessions.filter(session => session.host === userId || session.participant === userId);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getMyRecentSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getSessionById(req, res) {
  try {
    const { id } = req.params;

    const session = Session.findById(id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    // Populate host and participant
    const host = User.findOne({ id: session.host });
    const participant = session.participant ? User.findOne({ id: session.participant }) : null;

    res.status(200).json({ session: { ...session, host, participant } });
  } catch (error) {
    console.log("Error in getSessionById controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const clerkId = req.user.clerkId;

    console.log(`[JOIN] User ${userId} joining session ${id}`);

    const session = Session.findById(id);
    if (!session) {
      console.log(`[JOIN] Session not found: ${id}`);
      return res.status(404).json({ message: "Session not found" });
    }

    console.log(`[JOIN] Session status: ${session.status}`);

    if (session.status !== "active") {
      return res.status(400).json({ message: "Cannot join a completed session" });
    }

    // If user is the host, they're already joined
    if (session.host === userId) {
      console.log(`[JOIN] User is host`);
      return res.status(200).json({ session, message: "Already in session as host" });
    }

    // check if session is already full
    if (session.participant) {
      console.log(`[JOIN] Session full`);
      return res.status(409).json({ message: "Session is full" });
    }

    // update session with participant
    const updatedSession = Session.findByIdAndUpdate(id, { participant: userId });
    console.log(`[JOIN] Session updated`);

    // add participant to stream call (non-critical)
    try {
      const call = streamClient.video.call("default", session.callId);
      await call.updateCallMembers({
        update_members: [{ user_id: clerkId, role: "participant" }],
      });
    } catch (err) {
      console.warn("[JOIN] Stream error (non-critical):", err.message);
    }

    // add participant to chat channel (non-critical)
    try {
      const channel = chatClient.channel("messaging", session.callId);
      await channel.addMembers([clerkId]);
    } catch (err) {
      console.warn("[JOIN] Chat error (non-critical):", err.message);
    }

    res.status(200).json({ session: updatedSession });
  } catch (error) {
    console.error("Error in joinSession:", error);
    res.status(500).json({ message: "Internal Server Error: " + error.message });
  }
}

export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const session = Session.findById(id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    // check if user is the host
    if (session.host !== userId) {
      return res.status(403).json({ message: "Only the host can end the session" });
    }

    // check if session is already completed
    if (session.status === "completed") {
      return res.status(400).json({ message: "Session is already completed" });
    }

    // delete stream video call
    const call = streamClient.video.call("default", session.callId);
    await call.delete({ hard: true });

    // delete stream chat channel
    const channel = chatClient.channel("messaging", session.callId);
    await channel.delete();

    Session.findByIdAndUpdate(id, { status: "completed" });

    res.status(200).json({ session: { ...session, status: "completed" }, message: "Session ended successfully" });
  } catch (error) {
    console.log("Error in endSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
