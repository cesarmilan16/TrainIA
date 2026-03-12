import { TestBed } from '@angular/core/testing';
import { convertToParamMap, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { TrainingDetail } from './training-detail';
import { TrainingApiService } from '../../../../core/trainings/training-api.service';
import { TrainingDetailResponse } from '../../../../core/trainings/training-api.models';

describe('TrainingDetail', () => {
  it('should show loading first and then render the training goal', async () => {
    const response$ = new Subject<TrainingDetailResponse>();

    const trainingApiMock = {
      getTrainingById: () => response$.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [TrainingDetail],
      providers: [
        { provide: TrainingApiService, useValue: trainingApiMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: 'training-001' }),
            },
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TrainingDetail);
    fixture.detectChanges();

    let compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Cargando entrenamiento...');

    response$.next({
      id: 'training-001',
      status: 'COMPLETED',
      createdAt: '2026-03-12T10:00:00.000Z',
      input: {
        goal: 'Ganar masa muscular',
        daysPerWeek: 4,
        trainingSplit: 'push_pull_legs',
        experienceLevel: 'intermediate',
        equipment: 'gym',
      },
      training: {
        title: 'Plan 4 dias',
        description: 'Rutina de ejemplo',
        days: [
          {
            dayNumber: 1,
            workout: 'Push',
            exercises: [{ name: 'Press banca', sets: 4, reps: '6-8' }],
          },
        ],
      },
    });
    response$.complete();

    fixture.detectChanges();
    compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Ganar masa muscular');
    expect(compiled.textContent).toContain('Plan 4 dias');
  });
});
