import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html'
})
export class HomeComponent implements OnInit {
  private api = inject(ApiService);
  backendHealth: any = null;
  healthLoading = true;

  ngOnInit(): void {
    this.api.getHealth().subscribe({
      next: (data) => {
        this.backendHealth = data;
        this.healthLoading = false;
      },
      error: (err) => {
        this.backendHealth = { status: 'OFFLINE', message: err.message };
        this.healthLoading = false;
      }
    });
  }
}
