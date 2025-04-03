import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom, Subject, take } from 'rxjs';
import { UserAuth } from '../models/user-auth.interface';
import { BehaviorSubject } from 'rxjs';
import { AuthData } from '../models/authdata.interface';
import { UserDetails } from '../models/user.interface';
type MyTimer = ReturnType<typeof setTimeout>;

interface RegistrationUser {
  message: string;
  user: UserAuth;
  status: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private isAuthenticated = false;
  private token!: string;
  private tokenTimer!: MyTimer;
  private userId!: string | null;
  private authStatusListener = new Subject<boolean>();
  private dataSubject = new BehaviorSubject<UserAuth | null>(null);
  data$ = this.dataSubject.asObservable();

  constructor(
    private http: HttpClient,
    public router: Router,
  ) {}

  /**
   * Login User
   * @param {UserAuth} data
   * @returns {Promise<UserAuth>}
   */
  async userLogin(data: UserAuth): Promise<UserAuth | null> {
    const userData = this.http.post<UserAuth>('/login/', data);
    const response = await lastValueFrom(userData.pipe(take(1)));
    if (response && response.token) {
      const token = response.token;
      this.token = token;
      const expiresInDuration = response.expiresIn;
      this.setAuthTimer(expiresInDuration);
      this.isAuthenticated = true;
      this.userId = response.userId;
      this.authStatusListener.next(true);
      this.dataSubject.next(response);
      const user = JSON.stringify(response);
      localStorage.setItem('userDetails', user);
      const now = new Date();
      const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
      this.saveAuthData(token, expirationDate, this.userId);
      this.router.navigate(['/dashboard']);
      return response;
    }
    return null;
  }
  
  public getToken() {
    return this.token;
  }

  public getIsAuth() {
    return this.isAuthenticated;
  }

  public getUserId() {
    return this.userId;
  }

  public getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  public autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.clear();
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
      localStorage.clear();
    }, duration * 1000);
  }

  public logout() {
    this.token = '';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    };
  }

  /**
   * Create User
   * @param {AuthData} data
   * @returns {Promise<RegistrationUser>}
   */
  async userRegister(data: AuthData): Promise<RegistrationUser> {
    const userData = this.http.post<RegistrationUser>('/signup', data);
    return await lastValueFrom(userData.pipe(take(1)));
  }

  /**
   * fetch all employees
   * @returns {Promise<AuthData>}
   */
  async findAll(query: string): Promise<AuthData> {
    const allUser = this.http.get<AuthData>(`/getAllUser/${query}`);
    return await lastValueFrom(allUser.pipe(take(1)));
  }

  /**
   * Create User
   * @param {AuthData} data
   * @returns {Promise<RegistrationUser>}
   */
  async userProfileData(data: AuthData): Promise<RegistrationUser> {
    const userData = this.http.post<RegistrationUser>('/createprofile', data);
    return await lastValueFrom(userData.pipe(take(1)));
  }

  /**
   * Find User id wise record
   * @param {number} userId
   * @returns {Promise<UserDetails>}
   */
  async findUser(userId: string): Promise<UserDetails> {
    const user = this.http.get<UserDetails>('/user/' + userId);
    return await lastValueFrom(user.pipe(take(1)));
  }

  /**
   * Update employee
   * @param {string} userId
   * @param {AuthData} data
   * @returns {Promise<AuthData>}
   */
  async update(userId: string, data: AuthData): Promise<AuthData> {
    const user = this.http.put<AuthData>('/update/' + userId, data);
    return await lastValueFrom(user.pipe(take(1)));
  }

  /**
   * Delete employee
   * @param {string} userId
   * @returns {Promise<AuthData>}
   */
  async userDelete(userId: string): Promise<AuthData> {
    const user = this.http.delete<AuthData>('/remove/' + userId);
    return await lastValueFrom(user.pipe(take(1)));
  }

}
