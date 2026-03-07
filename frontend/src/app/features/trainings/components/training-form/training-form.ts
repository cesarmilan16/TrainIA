import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TrainingSplit, ExperienceLevel, Equipment } from '../../../../core/trainings/training-api.models';
import { TrainingApiService } from '../../../../core/trainings/training-api.service';

@Component({
  selector: 'app-training-form',
  imports: [ ReactiveFormsModule ],
  templateUrl: './training-form.html',
  styleUrl: './training-form.css',
})
export class TrainingForm {
  private readonly trainingApi = inject(TrainingApiService);
  private readonly fb = inject(FormBuilder);


}
