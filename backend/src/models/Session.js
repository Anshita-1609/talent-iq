import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sessionsFilePath = path.join(__dirname, '../../data/sessions.json');

class Session {
  constructor(data) {
    this.problem = data.problem;
    this.difficulty = data.difficulty;
    this.host = data.host; // string ID
    this.participant = data.participant || null; // string ID
    this.status = data.status || 'active';
    this.callId = data.callId || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.id = data.id || Session.generateId();
  }

  static generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  static readSessions() {
    try {
      const data = fs.readFileSync(sessionsFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  static writeSessions(sessions) {
    fs.writeFileSync(sessionsFilePath, JSON.stringify(sessions, null, 2));
  }

  static findOne(query) {
    const sessions = this.readSessions();
    return sessions.find(session => {
      for (const key in query) {
        if (session[key] !== query[key]) return false;
      }
      return true;
    });
  }

  static find(query = {}) {
    const sessions = this.readSessions();
    return sessions.filter(session => {
      for (const key in query) {
        if (session[key] !== query[key]) return false;
      }
      return true;
    });
  }

  static create(data) {
    const sessions = this.readSessions();
    const newSession = new Session(data);
    sessions.push(newSession);
    this.writeSessions(sessions);
    return newSession;
  }

  static findById(id) {
    const sessions = this.readSessions();
    return sessions.find(session => session.id === id);
  }

  static findByIdAndUpdate(id, updateData) {
    const sessions = this.readSessions();
    const index = sessions.findIndex(session => session.id === id);
    if (index === -1) return null;
    sessions[index] = { ...sessions[index], ...updateData, updatedAt: new Date() };
    this.writeSessions(sessions);
    return sessions[index];
  }

  static findByIdAndDelete(id) {
    const sessions = this.readSessions();
    const index = sessions.findIndex(session => session.id === id);
    if (index === -1) return null;
    const deletedSession = sessions.splice(index, 1)[0];
    this.writeSessions(sessions);
    return deletedSession;
  }

  save() {
    const sessions = Session.readSessions();
    const index = sessions.findIndex(s => s.id === this.id);
    if (index === -1) {
      sessions.push(this);
    } else {
      sessions[index] = this;
    }
    Session.writeSessions(sessions);
  }
}

export default Session;
