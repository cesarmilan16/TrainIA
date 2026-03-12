import { Component, inject, signal } from '@angular/core';
import { TrainingApiService } from '../../../../core/trainings/training-api.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  Equipment,
  ExperienceLevel,
  TrainingDetailResponse,
  TrainingSplit,
  TrainingStatus,
} from '../../../../core/trainings/training-api.models';
import { switchMap, takeWhile, timer } from 'rxjs';

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
  readonly isRegenerating = signal(false);
  readonly error = signal('');

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTrainingById(id);
      return;
    }

    this.error.set('No se encontró el entrenamiento');
    this.isLoading.set(false);
  }

  loadTrainingById(id: string): void {
    this.error.set('');

    this.trainingApi.getTrainingById(id).subscribe({
      next: (res) => {
        this.training.set(res);
        this.isLoading.set(false);

        if (res.status === 'GENERATING') {
          this.startPolling(id);
        }
      },
      error: () => {
        this.error.set('No se pudo cargar el entrenamiento');
        this.isLoading.set(false);
      }
    });
  }

  private startPolling(id: string): void {
    // Dejamos visible el estado "GENERATING" antes de consultar el primer refresh.
    timer(2500, 2500)
      .pipe(
        switchMap(() => this.trainingApi.getTrainingById(id)),
        takeWhile((detail) => detail.status === 'GENERATING', true)
      )
      .subscribe({
        next: (detail) => {
          this.training.set(detail);

          if (detail.status !== 'GENERATING') {
            this.isRegenerating.set(false);
          }
        },
        error: () => {
          this.error.set('No se pudo consultar el estado del entrenamiento');
          this.isRegenerating.set(false);
        }
      });
  }

  regenerateTraining(): void {
    const id = this.training()?.id;

    if (!id || this.isRegenerating()) {
      return;
    }

    this.error.set('');
    this.isRegenerating.set(true);

    this.trainingApi.regenerateTraining(id).subscribe({
      next: (res) => {
        this.training.update((current) => current
          ? {
            ...current,
            status: res.status,
            canRegenerate: false,
            remainingRegenerations: Math.max(0, current.remainingRegenerations - 1),
            training: undefined,
          }
          : current);
        this.startPolling(res.id);
      },
      error: (err) => {
        const backendMessage = err?.error?.error;
        this.error.set(backendMessage ?? 'No se pudo regenerar el entrenamiento');
        this.isRegenerating.set(false);
      }
    });
  }

  canRegenerate(): boolean {
    const detail = this.training();

    if (!detail) {
      return false;
    }

    return detail.canRegenerate && !this.isRegenerating();
  }

  getTrainingSplitLabel(split: TrainingSplit): string {
    const labels: Record<TrainingSplit, string> = {
      fullbody: 'Full body',
      upper_lower: 'Torso / pierna',
      push_pull_legs: 'Push / pull / legs',
      weider: 'Weider',
    };

    return labels[split];
  }

  getExperienceLevelLabel(level: ExperienceLevel): string {
    const labels: Record<ExperienceLevel, string> = {
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      advanced: 'Avanzado',
    };

    return labels[level];
  }

  getEquipmentLabel(equipment: Equipment): string {
    const labels: Record<Equipment, string> = {
      gym: 'Gimnasio completo',
      home_dumbbells: 'Mancuernas en casa',
      calisthenics: 'Calistenia',
    };

    return labels[equipment];
  }

  getStatusLabel(status: TrainingStatus): string {
    const labels: Record<TrainingStatus, string> = {
      GENERATING: 'Generando',
      COMPLETED: 'Completado',
      FAILED: 'Fallido',
    };

    return labels[status];
  }

  getStatusClasses(status: TrainingStatus): string {
    const classes: Record<TrainingStatus, string> = {
      GENERATING: 'border-amber-800 bg-amber-950 text-amber-300',
      COMPLETED: 'border-emerald-800 bg-emerald-950 text-emerald-300',
      FAILED: 'border-rose-800 bg-rose-950 text-rose-300',
    };

    return classes[status];
  }

  formatDate(value: string): string {
    return new Intl.DateTimeFormat('es-ES', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  }
}
