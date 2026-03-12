import { Component, inject, signal } from '@angular/core';
import { TrainingApiService } from '../../../../core/trainings/training-api.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TrainingDetailResponse } from '../../../../core/trainings/training-api.models';

@Component({
  selector: 'app-training-detail',
  imports: [RouterLink],
  templateUrl: './training-detail.html',
  styles: ``,
})
export class TrainingDetail {
  private readonly trainingApi = inject(TrainingApiService);
  private readonly route = inject(ActivatedRoute);

  readonly training = signal<TrainingDetailResponse | null>(null);
  readonly isLoading = signal(true);
  readonly error = signal('');

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTrainingById(id);
    }
  }

  loadTrainingById(id: string): void {
    this.trainingApi.getTrainingById(id).subscribe({
      next: (res) => {
        this.training.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el entrenamiento');
        this.isLoading.set(false);
      }
    });
  }
}
