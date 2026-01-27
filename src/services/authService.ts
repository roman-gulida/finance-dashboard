import { api } from '../lib/api.ts';
import type { UserCredentials, User } from '../types/types.ts';

const BASE_ENDPOINT = '/users';

export async function register(credentials: UserCredentials): Promise<User> {
  const existingUser = await getUser(credentials.username);
  if (existingUser) {
    throw new Error('Account existed before registration. Please Sign in.');
  }

  return api.post<User>(BASE_ENDPOINT, credentials);
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
  const data = await api.get<User[]>(BASE_ENDPOINT, { params: { username } });
  return data[0] || null;
}
