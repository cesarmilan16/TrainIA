import { Routes } from '@angular/router';
import { TrainingForm } from './features/trainings/components/training-form/training-form';
import { HealthCheck } from './features/trainings/components/health-check/health-check';
import { TrainingList } from './features/trainings/components/training-list/training-list';

export const routes: Routes = [
  { path: 'form', component: TrainingForm },
  { path: 'trainings', component: TrainingList},
  { path: 'health', component: HealthCheck }
];
