import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container py-5 text-center">
      <div class="display-1 text-danger fw-bold">404</div>
      <h2 class="fw-bold mb-3">Page Not Found</h2>
      <p class="text-muted mb-4">The route you navigated to does not exist in the Angular application.</p>
      <a routerLink="/home" class="btn btn-danger px-4 py-2">
        <i class="bi bi-house-door me-2"></i>Return to Home
      </a>
    </div>
  `
})
export class NotFoundComponent {}
