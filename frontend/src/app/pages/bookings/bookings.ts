import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService, Booking } from '../../services/api.service';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './bookings.html'
})
export class BookingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);

  servicesList = [
    { name: 'Computerized 3D Alignment & Wheel Balancing', price: 1200 },
    { name: 'Standalone Computerized 3D Laser Alignment', price: 650 },
    { name: 'High-Speed 4-Wheel Dynamic Balancing & Zinc Weights', price: 550 },
    { name: 'Automotive Battery Health Diagnostic & Alternator Load Test', price: 350 },
    { name: 'Nitrogen Purging & All-Wheel Rotation', price: 400 },
    { name: 'Allied Division: Solar Water Heater Descaling & Tank Flush', price: 1500 },
    { name: 'Allied Division: RO Water Purifier 8-Stage Filter Replacement', price: 850 }
  ];

  bookingForm: FormGroup = this.fb.group({
    serviceIndex: [0, [Validators.required]],
    customerName: ['', [Validators.required, Validators.minLength(3)]],
    customerEmail: ['', [Validators.required, Validators.email]],
    customerPhone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    vehicleNumber: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9\s-]{6,14}$/)]],
    bookingDate: ['', [Validators.required]],
    timeSlot: ['10:30 AM', [Validators.required]],
    notes: ['']
  });

  isSubmitting = false;
  createdBooking: Booking | null = null;
  errorMessage = '';

  minDate: string = '';

  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];
    this.minDate = today;

    // Pre-populate with current logged-in user if available
    const user = this.api.getCurrentUser();
    if (user) {
      this.bookingForm.patchValue({
        customerName: user.full_name,
        customerEmail: user.email,
        customerPhone: user.phone,
        vehicleNumber: user.vehicle_number,
        bookingDate: today
      });
    } else {
      this.bookingForm.patchValue({
        bookingDate: today
      });
    }
  }

  getSelectedService(): { name: string; price: number } {
    const idx = this.bookingForm.get('serviceIndex')?.value || 0;
    return this.servicesList[idx] || this.servicesList[0];
  }

  isInvalid(controlName: string): boolean {
    const ctrl = this.bookingForm.get(controlName);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.createdBooking = null;

    const values = this.bookingForm.value;
    const selectedService = this.getSelectedService();
    const user = this.api.getCurrentUser();

    const bookingPayload: Booking = {
      customerId: user ? user.id : 1,
      customerName: values.customerName.trim(),
      customerEmail: values.customerEmail.trim(),
      customerPhone: values.customerPhone.trim(),
      vehicleNumber: values.vehicleNumber.trim().toUpperCase(),
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      bookingDate: values.bookingDate,
      timeSlot: values.timeSlot,
      notes: values.notes ? values.notes.trim() : null
    };

    this.api.createBooking(bookingPayload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.success && res.data) {
          this.createdBooking = res.data;
        } else {
          this.errorMessage = res.message || 'Could not record booking.';
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.error || err.message || 'Booking submission error.';
      }
    });
  }
}
