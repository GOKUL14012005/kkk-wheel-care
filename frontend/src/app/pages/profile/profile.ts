import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService, Customer, Booking } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.html'
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);

  customer: Customer | null = null;
  bookings: Booking[] = [];
  isLoading = true;
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  profileForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    vehicleNumber: ['', [Validators.required]],
    vehicleType: ['Sedan', [Validators.required]],
    city: ['', [Validators.required]],
    pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
  });

  ngOnInit(): void {
    const user = this.api.getCurrentUser();
    const customerId = user ? user.id : 1; // Default to seed customer 1 if not logged in

    this.loadProfile(customerId);
    this.loadBookings(customerId);
  }

  loadProfile(id: number): void {
    this.api.getCustomerProfile(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.customer = res.data;
          this.profileForm.patchValue({
            fullName: res.data.full_name,
            phone: res.data.phone,
            vehicleNumber: res.data.vehicle_number,
            vehicleType: res.data.vehicle_type,
            city: res.data.city || 'Chennai',
            pincode: res.data.pincode || '600001'
          });
        }
        this.isLoading = false;
      },
      error: () => {
        // Safe generic fallback if backend is offline or starting up
        this.customer = {
          id: id,
          full_name: 'Valued Customer',
          email: 'customer@kkkwheelcare.com',
          phone: '9000000000',
          vehicle_number: 'TN-00-AA-0000',
          vehicle_type: 'Sedan',
          city: 'Chennai',
          pincode: '600001'
        };
        this.profileForm.patchValue({
          fullName: this.customer.full_name,
          phone: this.customer.phone,
          vehicleNumber: this.customer.vehicle_number,
          vehicleType: this.customer.vehicle_type,
          city: this.customer.city,
          pincode: this.customer.pincode
        });
        this.isLoading = false;
      }
    });
  }

  loadBookings(customerId: number): void {
    this.api.getBookings(customerId).subscribe({
      next: (res) => {
        if (res.success) {
          this.bookings = res.data;
        }
      },
      error: () => {
        this.bookings = [];
      }
    });
  }

  onSave(): void {
    if (this.profileForm.invalid || !this.customer) return;

    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload = this.profileForm.value;
    this.api.updateCustomerProfile(this.customer.id, payload).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.success) {
          this.successMessage = 'Profile updated successfully in MySQL!';
          this.customer = res.data;
          setTimeout(() => this.successMessage = '', 4000);
        }
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = err.error?.error || err.message || 'Failed to update profile.';
      }
    });
  }

  logout(): void {
    this.api.logout();
    this.router.navigate(['/login']);
  }
}
