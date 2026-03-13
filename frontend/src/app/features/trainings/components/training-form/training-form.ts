import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TrainingSplit, ExperienceLevel, Equipment, GeneratedTraining } from '../../../../core/trainings/training-api.models';
import { TrainingApiService } from '../../../../core/trainings/training-api.service';
import { switchMap, takeWhile, timer } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-training-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './training-form.html',
})
export class TrainingForm {
  private readonly trainingApi = inject(TrainingApiService);
  private readonly fb = inject(FormBuilder);

  readonly isSubmitting = signal(false);
  readonly apiError = signal('');
  readonly generatedId = signal('');
  readonly generatedStatus = signal('');
  readonly generatedTraining = signal<GeneratedTraining | null>(null);

  readonly trainingSplits: TrainingSplit[] = ['fullbody', 'upper_lower', 'push_pull_legs', 'weider'];
  readonly experienceLevels: ExperienceLevel[] = ['beginner', 'intermediate', 'advanced'];
  readonly equipments: Equipment[] = ['gym', 'home_dumbbells', 'calisthenics'];
  readonly trainingSplitLabels: Record<TrainingSplit, string> = {
    fullbody: 'Full body',
    upper_lower: 'Torso / pierna',
    push_pull_legs: 'Push / pull / legs',
    weider: 'Weider',
  };
  readonly experienceLevelLabels: Record<ExperienceLevel, string> = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
  };
  readonly equipmentLabels: Record<Equipment, string> = {
    gym: 'Gimnasio completo',
    home_dumbbells: 'Mancuernas en casa',
    calisthenics: 'Calistenia',
  };


  readonly form = this.fb.nonNullable.group({
    goal: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    daysPerWeek: [2, [Validators.required, Validators.min(2), Validators.max(6)]],
    trainingSplit: [this.trainingSplits[0], [Validators.required]],
    experienceLevel: [this.experienceLevels[0], [Validators.required]],
    equipment: [this.equipments[0], [Validators.required]],
  });

  private startPolling(id: string): void {
    // Consulta periódicamente el backend hasta que la generación termine.
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
            this.isSubmitting.set(false);
          }

          if (detail.status === 'FAILED') {
            this.apiError.set('La generación falló');
            this.isSubmitting.set(false);
          }
        },
        error: (err) => {
          const msg = err?.error?.error ?? 'Error consultando el estado';
          this.generatedStatus.set('FAILED');
          this.apiError.set(msg);
          this.isSubmitting.set(false);
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

    // Enviamos exactamente el shape que espera el endpoint de generación.
    const payload = this.form.getRawValue();

    this.trainingApi
      .generateTraining(payload)
      .subscribe({
        next: (res) => {
          this.generatedId.set(res.id);
          this.startPolling(res.id);
          this.generatedStatus.set(res.status);
        },
        error: (err) => {
          const backendMessage = err?.error?.errors?.[0]?.message || err?.error?.error;
          this.apiError.set(backendMessage ?? 'Error al generar entrenamiento');
          this.isSubmitting.set(false);
        },
      });
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

  getTrainingSplitLabel(split: TrainingSplit): string {
    const labels: Record<TrainingSplit, string> = {
      fullbody: 'Full body',
      upper_lower: 'Torso / pierna',
      push_pull_legs: 'Push / pull / legs',
      weider: 'Weider',
    };

    return labels[split];
  }

}
