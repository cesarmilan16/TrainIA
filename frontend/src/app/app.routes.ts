import { Routes } from '@angular/router';
import { TrainingForm } from './features/trainings/components/training-form/training-form';
import { HealthCheck } from './features/trainings/components/health-check/health-check';

export const routes: Routes = [
  { path: '', component: TrainingForm },
  { path: 'generate', component: TrainingForm },
  { path: 'health', component: HealthCheck },
];
