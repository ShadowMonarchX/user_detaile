import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss'],
})
export class UserRegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private authService: AuthServiceService,
    private toastrService: ToastrService,
  ) {}

  ngOnInit() {
    this.userRegisterForm();
  }

  userRegisterForm() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      for (const control of Object.keys(this.registerForm.controls)) {
        this.registerForm.controls[control].markAsTouched();
      }
      return;
    } else {
      try {
        const result = await this.authService.userRegister(
          this.registerForm.value,
        );
        if (result.status === 200) {
          this.toastrService.success(result.message);
          this.registerForm.reset();
          this.router.navigate(['/auth/login']);
        }
      } catch (err) {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 400) {
            this.toastrService.error(err.error.message);
          }
          if (err.status === 404) {
            this.toastrService.error(err.statusText);
          }
          if (err.status === 500) {
            this.toastrService.error(err.statusText);
          }
        }
      }
    }
  }
}
