import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { App_Apis } from '../../../core/constants/app-apis';
import { Stored_Keys } from '../../../core/constants/stored-keys';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface IAuthResponse {
  message: string;
  user: IUser;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly platform = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);

  refreshToken = signal(0);

  userToken = computed(() => {
    this.refreshToken();
    if (isPlatformBrowser(this.platform)) {
      return localStorage.getItem(Stored_Keys.token);
    } else {
      return null;
    }
  });

  currentUser = computed(() => {
    const token = this.userToken();
    if (!token) return null;
    try {
      return jwtDecode(token) as IUser;
    } catch {
      return null;
    }
  });

  login(userData: {}) {
    return this.http.post<IAuthResponse>(App_Apis.auth.login, userData);
  }

  register(userData: {}) {
    return this.http.post<IAuthResponse>(App_Apis.auth.register, userData);
  }

  forgotPassword(email: string) {
    return this.http.post<{ statusMsg: string; message: string }>(
      App_Apis.auth.forgotPassword,
      { email }
    );
  }

  verifyResetCode(resetCode: string) {
    return this.http.post<{ status: string }>(App_Apis.auth.verifyResetCode, {
      resetCode,
    });
  }

  resetPassword(email: string, newPassword: string) {
    return this.http.put<IAuthResponse>(App_Apis.auth.resetPassword, {
      email,
      newPassword,
    });
  }

  logout(): void {
    localStorage.clear();
    this.refreshToken.update((v) => v + 1);
  }

  decodeToken() {
    try {
      const decoded = jwtDecode(this.userToken()!) as IUser;
      localStorage.setItem(Stored_Keys.userId, decoded.id);
    } catch {}
  }
}