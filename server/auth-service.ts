import bcrypt from 'bcryptjs';
import { getDb } from './db';
import { eq } from 'drizzle-orm';

// We'll use a simple in-memory users table for demo
// In production, this would query the database
const demoUsers = [
  {
    id: 1,
    username: 'john.chawana',
    email: 'John.Chawana@mcckc.edu',
    name: 'John Chawana',
    passwordHash: '', // Will be set below
    role: 'admin',
  },
];

// Generate password hash for demo user
async function initializeDemoUser() {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('MCC@Demo123', salt);
  demoUsers[0].passwordHash = passwordHash;
}

initializeDemoUser().catch(console.error);

export async function authenticateUser(username: string, password: string) {
  try {
    // Check demo users first
    const user = demoUsers.find((u) => u.username === username);
    
    if (user && user.passwordHash) {
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (isValid) {
        return {
          success: true,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        };
      }
    }

    return {
      success: false,
      error: 'Invalid username or password',
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      error: 'Authentication failed',
    };
  }
}

export function getDemoCredentials() {
  return {
    username: 'john.chawana',
    password: 'MCC@Demo123',
    email: 'John.Chawana@mcckc.edu',
    name: 'John Chawana',
    role: 'admin',
  };
}
