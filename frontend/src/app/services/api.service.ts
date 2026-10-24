import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
  id: number;
  sku: string;
  name: string;
  category: 'tyres' | 'batteries' | 'services' | 'solar' | 'purifiers';
  brand: string;
  description: string;
  price: number;
  stock_quantity: number;
  vehicle_type?: string;
  terrain?: string;
  specifications?: any;
  image_url?: string;
  is_active: boolean;
}

export interface Customer {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  vehicle_number: string;
  vehicle_type: string;
  city?: string;
  pincode?: string;
  role?: string;
}

export interface Booking {
  id?: number;
  booking_reference?: string;
  customer_id?: number | null;
  customerId?: number | null;
  customer_name?: string;
  customerName?: string;
  customer_email?: string;
  customerEmail?: string;
  customer_phone?: string;
  customerPhone?: string;
  vehicle_number?: string;
  vehicleNumber?: string;
  service_name?: string;
  serviceName?: string;
  service_price?: number;
  servicePrice?: number;
  booking_date?: string;
  bookingDate?: string;
  time_slot?: string;
  timeSlot?: string;
  notes?: string | null;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  private currentUserSubject = new BehaviorSubject<Customer | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  private getAuthHeaders(): { headers?: HttpHeaders } {
    const token = localStorage.getItem('kkk_angular_token');
    if (token) {
      return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
    }
    return {};
  }

  private getStoredUser(): Customer | null {
    try {
      const stored = localStorage.getItem('kkk_angular_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  // Health
  getHealth(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/health`);
  }

  // Products CRUD
  getProducts(category?: string): Observable<{ success: boolean; count: number; data: Product[] }> {
    const url = category && category !== 'all' 
      ? `${this.baseUrl}/products?category=${encodeURIComponent(category)}`
      : `${this.baseUrl}/products`;
    return this.http.get<{ success: boolean; count: number; data: Product[] }>(url);
  }

  getProductById(id: number): Observable<{ success: boolean; data: Product }> {
    return this.http.get<{ success: boolean; data: Product }>(`${this.baseUrl}/products/${id}`);
  }

  // Customer Auth & Profile
  registerCustomer(payload: any): Observable<{ success: boolean; message: string; data: Customer }> {
    return this.http.post<{ success: boolean; message: string; data: Customer }>(`${this.baseUrl}/customers/register`, payload)
      .pipe(
        tap(res => {
          if (res.success && res.data) {
            localStorage.setItem('kkk_angular_user', JSON.stringify(res.data));
            this.currentUserSubject.next(res.data);
          }
        })
      );
  }

  loginCustomer(payload: { email: string; password: string }): Observable<{ success: boolean; message: string; data: Customer; token: string }> {
    return this.http.post<{ success: boolean; message: string; data: Customer; token: string }>(`${this.baseUrl}/customers/login`, payload)
      .pipe(
        tap(res => {
          if (res.success && res.data) {
            localStorage.setItem('kkk_angular_token', res.token);
            localStorage.setItem('kkk_angular_user', JSON.stringify(res.data));
            this.currentUserSubject.next(res.data);
          }
        })
      );
  }

  getCustomerProfile(id: number): Observable<{ success: boolean; data: Customer }> {
    return this.http.get<{ success: boolean; data: Customer }>(`${this.baseUrl}/customers/${id}`, this.getAuthHeaders());
  }

  updateCustomerProfile(id: number, payload: Partial<Customer>): Observable<{ success: boolean; message: string; data: Customer }> {
    return this.http.put<{ success: boolean; message: string; data: Customer }>(`${this.baseUrl}/customers/${id}`, payload, this.getAuthHeaders())
      .pipe(
        tap(res => {
          if (res.success && res.data) {
            localStorage.setItem('kkk_angular_user', JSON.stringify(res.data));
            this.currentUserSubject.next(res.data);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('kkk_angular_token');
    localStorage.removeItem('kkk_angular_user');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Customer | null {
    return this.currentUserSubject.value;
  }

  // Service Bookings
  getBookings(customerId?: number): Observable<{ success: boolean; count: number; data: Booking[] }> {
    const url = customerId 
      ? `${this.baseUrl}/bookings?customerId=${customerId}`
      : `${this.baseUrl}/bookings`;
    return this.http.get<{ success: boolean; count: number; data: Booking[] }>(url, this.getAuthHeaders());
  }

  createBooking(payload: Booking): Observable<{ success: boolean; message: string; data: Booking }> {
    return this.http.post<{ success: boolean; message: string; data: Booking }>(`${this.baseUrl}/bookings`, payload, this.getAuthHeaders());
  }

  // Seneca Microservice Recommendation Integration
  getTyreRecommendations(criteria: { vehicleType?: string; terrain?: string; budget?: number | null; preference?: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/recommendations/tyres`, criteria);
  }
}
