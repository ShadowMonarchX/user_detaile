import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceService } from '../services/auth-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthData } from '../models/authdata.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  filterText = '';
  userList: AuthData[] = [];
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private authService: AuthServiceService,
    private toastrService: ToastrService,
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  async getAllUsers() {
    try {
      const allUser = await this.authService.findAll(this.filterText);
      if (allUser.status === 200) {
        this.userList = allUser.user;
      }
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 404) {
          this.toastrService.error(err.statusText);
        } else {
          this.toastrService.error(err.error.message);
        }
      }
    }
  }

  onFilterTextChange() {
    this.getAllUsers();
  }

  async onUserDelete(UserId: string) {
    try {
      const user = await this.authService.userDelete(UserId);
      if (user.status === 200) {
        this.getAllUsers();
        this.toastrService.success(user.message);
      }
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 404) {
          this.toastrService.error(err.statusText);
        } else {
          this.toastrService.error(err.statusText);
        }
      }
    }
  }

  clearFilter() {
    this.filterText = '';
    this.getAllUsers();
  }

  isUserRecord(creatorId: string): boolean {
    const userID = this.authService.getUserId();
    return creatorId === userID;
  }
}
