import { Component, inject, signal } from '@angular/core';
import { TrainingApiService } from '../../../../core/trainings/training-api.service';
import { ExperienceLevel, TrainingListItem, TrainingSplit, Equipment, TrainingStatus } from '../../../../core/trainings/training-api.models';

@Component({
  selector: 'app-training-list',
  imports: [],
  templateUrl: './training-list.html',
  styles: ``,
})
export class TrainingList {
  private readonly trainingApi = inject(TrainingApiService);

  readonly trainings = signal<TrainingListItem[]>([]);
  readonly isLoading = signal(true);
  readonly error = signal('');

  constructor() {
    this.loadTrainings();
  }

  loadTrainings(): void {
    this.isLoading.set(true);
    this.error.set('');

    this.trainingApi.getTrainings().subscribe({
      next: (res) => {
        this.trainings.set(res.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los entrenamientos');
        this.isLoading.set(false);
      }
    });
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
      GENERATING: 'border-amber-200 bg-amber-50 text-amber-700',
      COMPLETED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      FAILED: 'border-rose-200 bg-rose-50 text-rose-700',
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
