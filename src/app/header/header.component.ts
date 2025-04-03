import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthServiceService } from '../services/auth-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userAuthenticated = false;
  email: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthServiceService) {
    this.authService.data$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      if (data && data.email) {
        this.email = data.email;
      } else {
        this.email = null;
      }
    });
  }

  ngOnInit(): void {
    const data = localStorage.getItem('userDetails');
    if (data !== null) {
      const obj = JSON.parse(data);
      this.email = obj.email;
    }
    this.userAuthenticated = this.authService.getIsAuth();
    this.authService
      .getAuthStatusListener()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isAuthenticate: boolean) => {
        this.userAuthenticated = isAuthenticate;
      });
  }

  public onLogOut() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
