import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer: NodeJS.Timer;

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post("http://localhost:3000/api/user/signup", authData)
    .subscribe(response => {
      console.log(response);
    })
  }

  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post<{ token: string, expiresIn: number }>("http://localhost:3000/api/user/login", authData)
    .subscribe(res => {
      const token = res.token;
      this.token = token;
      if (token) {
        const expiresInDuration = res.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + (expiresInDuration * 1000));
        this.saveAuthData(token, expirationDate)
        this.router.navigate(['/home']);
      }
    })
  }

  private setAuthTimer (duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    if (authInformation) {
      const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
      if (expiresIn > 0) {
        this.token = authInformation.token;
        this.isAuthenticated = true;
        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListener.next(true);
      }
    }
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
    };
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/login"]);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  constructor(private http: HttpClient, private router: Router) { }
}
