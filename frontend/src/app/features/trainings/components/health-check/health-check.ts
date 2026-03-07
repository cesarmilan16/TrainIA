import { Component, inject, signal } from '@angular/core';
import { TrainingApiService } from '../../../../core/trainings/training-api.service';

@Component({
  selector: 'app-health-check',
  imports: [],
  templateUrl: './health-check.html',
  styleUrl: './health-check.css',
})
export class HealthCheck {
  private readonly trainingApi = inject(TrainingApiService);

  readonly healthStatus = signal('cargando...');

  constructor() {
    this.loadHealth();
  }

  private loadHealth(): void {
    this.trainingApi.health().subscribe({
      next: (res) => this.healthStatus.set(res.status),
      error: () => this.healthStatus.set('error de conexión'),
    });
  }
}
