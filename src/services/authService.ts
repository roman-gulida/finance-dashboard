import type { UserCredentials, User } from '../types/types.ts';

const BASE_URL = 'http://localhost:5000/users';

export async function register(credentials: UserCredentials): Promise<User> {
  const existingUser = await getUser(credentials.username);
  if (existingUser) {
    throw new Error('Account existed before registration. Please Sign in.');
  }
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    throw new Error('Failed to create user');
  }
  const createdUser = await res.json();
  return createdUser;
}

export async function login(credentials: UserCredentials): Promise<User> {
  const existingUser = await getUser(credentials.username);
  if (!existingUser) {
    throw new Error('Account does not exist. Please check the data and try again.');
  }
  if (existingUser.password === credentials.password) {
    return existingUser;
  }
  throw new Error(`Incorrect password! Please check the password and try again.`);
}

export async function getUser(username: string): Promise<User | null> {
  const res = await fetch(`${BASE_URL}?username=${username}`);
  if (!res.ok) {
    throw new Error('Fetch of user data failed');
  }
  const data = await res.json();
  const user = data[0];
  return user || null;
}
