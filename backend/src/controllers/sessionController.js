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

    const session = Session.findById(id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.status !== "active") {
      return res.status(400).json({ message: "Cannot join a completed session" });
    }

    if (session.host === userId) {
      return res.status(400).json({ message: "Host cannot join their own session as participant" });
    }

    // check if session is already full - has a participant
    if (session.participant) return res.status(409).json({ message: "Session is full" });

    // update session with participant
    Session.findByIdAndUpdate(id, { participant: userId });

    // add participant to stream call
    const call = streamClient.video.call("default", session.callId);
    await call.updateCallMembers({
      update_members: [{ user_id: clerkId, role: "participant" }],
    });

    // add participant to chat channel
    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);

    res.status(200).json({ session: { ...session, participant: userId } });
  } catch (error) {
    console.log("Error in joinSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
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
