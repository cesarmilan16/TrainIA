import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { TrainingSplit, ExperienceLevel, Equipment } from '../../../../core/trainings/training-api.models';
import { TrainingApiService } from '../../../../core/trainings/training-api.service';
import { finalize, switchMap, takeWhile, timer } from 'rxjs';

@Component({
  selector: 'app-training-form',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './training-form.html',
})
export class TrainingForm {
  private readonly trainingApi = inject(TrainingApiService);
  private readonly fb = inject(FormBuilder);

  readonly isSubmitting = signal(false);
  readonly apiError = signal('');
  readonly generatedId = signal('');
  readonly generatedStatus = signal('');
  readonly generatedTraining = signal<unknown | null>(null);

  readonly trainingSplits: TrainingSplit[] = ['fullbody', 'upper_lower', 'push_pull_legs', 'weider'];
  readonly experienceLevels: ExperienceLevel[] = ['beginner', 'intermediate', 'advanced'];
  readonly equipments: Equipment[] = ['gym', 'home_dumbbells', 'calisthenics'];


  readonly form = this.fb.nonNullable.group({
    goal: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    daysPerWeek: [2, [Validators.required, Validators.min(2), Validators.max(6)]],
    trainingSplit: [this.trainingSplits[0], [Validators.required]],
    experienceLevel: [this.experienceLevels[0], [Validators.required]],
    equipment: [this.equipments[0], [Validators.required]],
  });

  private startPolling(id: string): void {
    timer(0, 2500)
      .pipe(
        switchMap(() => this.trainingApi.getTrainingById(id)),
        takeWhile((detail) => detail.status === 'GENERATING', true)
      )
      .subscribe({
        next: (detail) => {
          this.generatedStatus.set(detail.status);

          if (detail.status === 'COMPLETED' && detail.training) {
            this.generatedTraining.set(detail.training);
          }

          if (detail.status === 'FAILED') {
            this.apiError.set('La generación falló');
          }
        },
        error: (err) => {
          const msg = err?.error?.error ?? 'Error consultando el estado';
          this.generatedStatus.set('FAILED');
          this.apiError.set(msg);
        }
      });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.apiError.set('');
    this.generatedId.set('');
    this.generatedStatus.set('');
    this.generatedTraining.set(null);
    this.isSubmitting.set(true);

    const payload = this.form.getRawValue();

    this.trainingApi
      .generateTraining(payload)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (res) => {
          this.generatedId.set(res.id);
          this.startPolling(res.id);
          this.generatedStatus.set(res.status);
        },
        error: (err) => {
          const backendMessage = err?.error?.errors?.[0]?.message || err?.error?.error;
          this.apiError.set(backendMessage ?? 'Error al generar entrenamiento');
        },
      });
  }
}
