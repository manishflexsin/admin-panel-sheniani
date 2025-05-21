'use client';
/* eslint-disable -- Allowing console logs for debugging purposes*/
import { LOGIN, LOGOUT } from '@/constants';
import type { User } from '@/types/user';
import { ToastContainer, toast } from 'react-toastify';

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

const user = {
  id: 'USR-000',
  avatar: '/assets/avatar.png',
  firstName: 'Sofiaa',
  lastName: 'Rivers',
  email: 'sofia@devias.io',
} satisfies User;

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}
class AuthClient {
  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    // Make API request

    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    const token = generateToken();
    localStorage.setItem('auth-token', token);

    return {};
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string; message?: string }> {
    try {
      const response = await fetch(`${LOGIN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      const data = await response.json();
      console.log(data);
      if (!response.ok) throw new Error(data.message || 'Invalid credentials');
  
      localStorage.setItem('auth-token', data.tokens.access.token);
      localStorage.setItem('refresh-token', data.tokens.refresh.token);
      
      return { message: data.message };
    } catch (error: any) {
      return { error: error.message };
    }
  }
  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Make API request

    // We do not handle the API, so just check if we have a token in localStorage.
    const token = localStorage.getItem('auth-token');

    if (!token) {
      return { data: null };
    }

    return { data: user };
  }

  async signOut(): Promise<{ error?: string, message?: string }> {
    try {
      const params = { refreshToken: localStorage.getItem('refresh-token') };
      const response = await fetch(`${LOGOUT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Invalid credentials');

      localStorage.removeItem('auth-token');
      localStorage.removeItem('refresh-token');
      return {message: data.message};
    } catch (error: any) {
      return { error: error.message };
    }
  }
}

export const authClient = new AuthClient();
