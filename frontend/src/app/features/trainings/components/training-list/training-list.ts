import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrainingApiService } from '../../../../core/trainings/training-api.service';
import { ExperienceLevel, TrainingListItem, TrainingSplit, Equipment, TrainingStatus, Pagination } from '../../../../core/trainings/training-api.models';

@Component({
  selector: 'app-training-list',
  imports: [RouterLink],
  templateUrl: './training-list.html',
  styles: ``,
})
export class TrainingList {
  private readonly pageSize = 6;
  private readonly trainingApi = inject(TrainingApiService);

  readonly trainings = signal<TrainingListItem[]>([]);
  // Mantiene el contexto de navegación para la paginación.
  readonly pagination = signal<Pagination | null>(null);
  readonly currentPage = signal(1);
  // Guarda temporalmente el id pendiente de confirmación en el modal.
  readonly trainingToDelete = signal<string | null>(null);
  readonly isLoading = signal(true);
  readonly error = signal('');

  constructor() {
    this.loadTrainings();
  }

  loadTrainings(page: number = this.currentPage(), limit: number = this.pageSize): void {
    if (!this.canLoadPage(page)) {
      return;
    }

    this.isLoading.set(true);
    this.error.set('');

    this.trainingApi.getTrainings(page, limit).subscribe({
      next: (res) => {
        this.trainings.set(res.data);
        this.pagination.set(res.pagination);
        this.currentPage.set(res.pagination.page);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los entrenamientos');
        this.isLoading.set(false);
      }
    });
  }

  canGoToPreviousPage(): boolean {
    return this.currentPage() > 1;
  }

  canGoToNextPage(): boolean {
    const pagination = this.pagination();

    if (!pagination || pagination.totalPages < 1) {
      return false;
    }

    return this.currentPage() < pagination.totalPages;
  }

  deleteTraining(id: string): void {
    this.trainingApi.deleteTraining(id).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.loadTrainings();
      },
      error: () => {
        this.error.set('No se pudo borrar el entrenamiento');
      }
    });
  }

  openDeleteModal(id: string): void {
    this.trainingToDelete.set(id);
  }

  closeDeleteModal(): void {
    this.trainingToDelete.set(null);
  }

  confirmDelete(): void {
    const id = this.trainingToDelete();

    if (!id) {
      return;
    }

    // El modal decide qué id borrar; el borrado real sigue centralizado aquí.
    this.deleteTraining(id);
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

  private canLoadPage(page: number): boolean {
    if (page < 1) {
      return false;
    }

    const pagination = this.pagination();

    if (!pagination) {
      return true;
    }

    return pagination.totalPages > 0 && page <= pagination.totalPages;
  }
}
