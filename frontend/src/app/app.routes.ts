import { Routes } from '@angular/router';
import { TrainingForm } from './features/trainings/components/training-form/training-form';
import { HealthCheck } from './features/trainings/components/health-check/health-check';
import { TrainingList } from './features/trainings/components/training-list/training-list';
import { TrainingDetail } from './features/trainings/components/training-detail/training-detail';

export const routes: Routes = [
  { path: 'form', component: TrainingForm },
  { path: 'trainings', component: TrainingList},
  { path: 'trainings/:id', component: TrainingDetail},
  { path: 'health', component: HealthCheck }
];
