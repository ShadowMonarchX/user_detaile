import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthServiceService,
    private toastrService: ToastrService,
    public router: Router,
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/dashboard']);
    }
    this.userLoginForm();
  }

  userLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  async onSubmit() {
    try {
      if (this.loginForm.invalid) {
        for (const control of Object.keys(this.loginForm.controls)) {
          this.loginForm.controls[control].markAsTouched();
        }
        return;
      }
      const result = await this.authService.userLogin(this.loginForm.value);
      if (result?.status === 200) {
        this.toastrService.success(result.message);
      }
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        if (err.status == 404) {
          this.toastrService.error(err.statusText);
        } else {
          this.toastrService.error(err.error.message);
        }
      }
    }
  }
}
