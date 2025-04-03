import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../services/auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class UserAuthGuardGuard {
  constructor(
    private authService: AuthServiceService,
    public router: Router,
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
    const isAuth = this.authService.getIsAuth();
    if (!isAuth) {
      this.router.navigate(['/auth/login']);
    }
    return isAuth;
  }
}
