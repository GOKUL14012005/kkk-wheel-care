import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    vehicleNumber: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9\s-]{6,14}$/)]],
    vehicleType: ['Sedan', [Validators.required]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/)
    ]],
    confirmPassword: ['', [Validators.required]],
    city: ['Chennai', [Validators.required]],
    pincode: ['600001', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    agreeTerms: [false, [Validators.requiredTrue]]
  }, { validators: passwordMatchValidator });

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  // Field status helpers for template
  isInvalid(controlName: string): boolean {
    const ctrl = this.registerForm.get(controlName);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  isValid(controlName: string): boolean {
    const ctrl = this.registerForm.get(controlName);
    return !!(ctrl && ctrl.valid && (ctrl.dirty || ctrl.touched));
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValues = this.registerForm.value;
    const payload = {
      fullName: formValues.fullName.trim(),
      email: formValues.email.trim(),
      phone: formValues.phone.trim(),
      vehicleNumber: formValues.vehicleNumber.trim().toUpperCase(),
      vehicleType: formValues.vehicleType,
      password: formValues.password,
      city: formValues.city.trim(),
      pincode: formValues.pincode.trim()
    };

    this.api.registerCustomer(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.success) {
          this.successMessage = 'Customer account registered successfully! Redirecting to profile...';
          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 1500);
        } else {
          this.errorMessage = res.message || 'Registration failed.';
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.error || err.message || 'Registration request could not be processed.';
      }
    });
  }
}
