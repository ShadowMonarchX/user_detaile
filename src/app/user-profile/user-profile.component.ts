import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceService } from '../services/auth-service.service';
import { Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
type UserId = string; // Define the UserId type

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  userProfileForm!: FormGroup;
  public mode = 'create';
  userId!: UserId | null;
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    public route: ActivatedRoute,
    public router: Router,
    private authService: AuthServiceService,
    private toastrService: ToastrService,
  ) {
    this.userId = null;
  }

  ngOnInit() {
    this.userRegisterForm();
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((paramMap: ParamMap) => {
        this.userId = paramMap.get('userId');
        if (this.userId != null) {
          this.mode = 'edit';
          this.getUserIdWiseData();
        } else {
          this.mode = 'create';
          this.userId = null;
        }
      });
  }

  userRegisterForm() {
    this.userProfileForm = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      city: ['', [Validators.required]],
      contactnumber: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  public onSubmit() {
    if (this.userProfileForm.invalid) {
      for (const control of Object.keys(this.userProfileForm.controls)) {
        this.userProfileForm.controls[control].markAsTouched();
      }
      return;
    }
    if (this.mode === 'create') {
      this.addUserProfile();
    } else {
      this.updateUserData();
    }
    this.userProfileForm.reset();
  }

  async addUserProfile() {
    try {
      const response = await this.authService.userProfileData(
        this.userProfileForm.value,
      );
      if (response.status === 200) {
        this.toastrService.success(response.message);
        this.router.navigate(['/dashboard']);
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

  async updateUserData() {
    try {
      if (this.userId !== null) {
        const response = await this.authService.update(
          this.userId,
          this.userProfileForm.value,
        );
        if (response.status === 200) {
          this.toastrService.success(response.message);
          this.router.navigate(['/dashboard']);
        }
      }
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 404) {
          this.toastrService.error(err.statusText);
        } else {
          this.toastrService.error(err.error.message);
          this.router.navigate(['/dashboard']);
        }
      }
    }
    this.userProfileForm.reset();
  }

  async getUserIdWiseData() {
    if (this.userId !== null) {
      const response = await this.authService.findUser(this.userId);
      if (response?.status == 200) {
        this.userProfileForm.patchValue({
          firstname: response.user.firstname,
          lastname: response.user.lastname,
          city: response.user.city,
          contactnumber: response.user.contactnumber,
        });
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
