import { api } from '../lib/api.ts';
import type { UserCredentials, User } from '../types/types.ts';

type AuthResponse = {
  user: User;
  token: string;
};

const BASE_ENDPOINT = '/api/auth';

export async function register(credentials: UserCredentials): Promise<AuthResponse> {
  return api.post<AuthResponse>(`${BASE_ENDPOINT}/register`, credentials);
}

export async function login(credentials: UserCredentials): Promise<AuthResponse> {
  return api.post<AuthResponse>(`${BASE_ENDPOINT}/login`, credentials);
}

export async function getMe(): Promise<User> {
  const data = await api.get<{ user: User }>(`${BASE_ENDPOINT}/me`);
  return data.user;
}
