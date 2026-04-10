import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersFilePath = path.join(__dirname, '../../data/users.json');

class User {
  constructor(data) {
    this.name = data.name;
    this.email = data.email;
    this.profileImage = data.profileImage || '';
    this.clerkId = data.clerkId;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.id = data.id || User.generateId();
  }

  static generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  static readUsers() {
    try {
      const data = fs.readFileSync(usersFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  static writeUsers(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  }

  static findOne(query) {
    const users = this.readUsers();
    return users.find(user => {
      for (const key in query) {
        if (user[key] !== query[key]) return false;
      }
      return true;
    });
  }

  static find(query = {}) {
    const users = this.readUsers();
    return users.filter(user => {
      for (const key in query) {
        if (user[key] !== query[key]) return false;
      }
      return true;
    });
  }

  static create(data) {
    const users = this.readUsers();
    const newUser = new User(data);
    users.push(newUser);
    this.writeUsers(users);
    return newUser;
  }

  static findByIdAndUpdate(id, updateData) {
    const users = this.readUsers();
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...updateData, updatedAt: new Date() };
    this.writeUsers(users);
    return users[index];
  }

  static findByIdAndDelete(id) {
    const users = this.readUsers();
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return null;
    const deletedUser = users.splice(index, 1)[0];
    this.writeUsers(users);
    return deletedUser;
  }

  save() {
    const users = User.readUsers();
    const index = users.findIndex(u => u.id === this.id);
    if (index === -1) {
      users.push(this);
    } else {
      users[index] = this;
    }
    User.writeUsers(users);
  }
}

export default User;
