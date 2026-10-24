import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, Product } from '../../services/api.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './products.html'
})
export class ProductsComponent implements OnInit {
  private api = inject(ApiService);

  products: Product[] = [];
  isLoading = true;
  errorMessage = '';
  selectedCategory = 'all';

  // Seneca Microservice Form Model & Results
  recVehicle = 'sedan';
  recTerrain = 'city';
  recBudget: number | null = 8000;
  recPreference = 'comfort';

  isSenecaMatching = false;
  senecaResult: any = null;
  senecaError = '';

  categories = [
    { id: 'all', label: 'All Products', icon: 'bi-grid-fill' },
    { id: 'tyres', label: 'Tyres', icon: 'bi-disc' },
    { id: 'batteries', label: 'Batteries', icon: 'bi-battery-charging' },
    { id: 'services', label: 'Workshop Services', icon: 'bi-wrench' },
    { id: 'solar', label: 'Solar Heaters', icon: 'bi-sun-fill' },
    { id: 'purifiers', label: 'Water Purifiers', icon: 'bi-droplet-half' }
  ];

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.api.getProducts(this.selectedCategory).subscribe({
      next: (res) => {
        if (res.success) {
          this.products = res.data;
        } else {
          this.errorMessage = 'Failed to load products from database.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = `Backend connection error: ${err.message || 'Make sure the Node server is running on port 5000.'}`;
        this.isLoading = false;
      }
    });
  }

  filterCategory(cat: string): void {
    this.selectedCategory = cat;
    this.fetchProducts();
  }

  runSenecaRecommendation(): void {
    this.isSenecaMatching = true;
    this.senecaError = '';
    this.senecaResult = null;

    const criteria = {
      vehicleType: this.recVehicle,
      terrain: this.recTerrain,
      budget: this.recBudget,
      preference: this.recPreference
    };

    this.api.getTyreRecommendations(criteria).subscribe({
      next: (res) => {
        this.isSenecaMatching = false;
        if (res.success) {
          this.senecaResult = res;
        } else {
          this.senecaError = res.validationErrors?.join(', ') || res.message || 'Validation error.';
        }
      },
      error: (err) => {
        this.isSenecaMatching = false;
        this.senecaError = err.error?.message || err.error?.error || 'Seneca microservice connection unavailable.';
      }
    });
  }
}
