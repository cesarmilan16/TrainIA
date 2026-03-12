import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { TrainingList } from './training-list';
import { TrainingApiService } from '../../../../core/trainings/training-api.service';

describe('TrainingList', () => {
  it('should render trainings returned by the API', async () => {
    const trainingApiMock = {
      getTrainings: () =>
        of({
          data: [
            {
              id: 'training-001',
              goal: 'Ganar masa muscular',
              daysPerWeek: 4,
              trainingSplit: 'push_pull_legs',
              experienceLevel: 'intermediate',
              equipment: 'gym',
              status: 'COMPLETED',
              createdAt: '2026-03-12T10:00:00.000Z',
            },
          ],
          pagination: {
            page: 1,
            limit: 6,
            total: 1,
            totalPages: 1,
          },
        }),
      deleteTraining: () => of(void 0),
    };

    await TestBed.configureTestingModule({
      imports: [TrainingList],
      providers: [
        provideRouter([]),
        { provide: TrainingApiService, useValue: trainingApiMock },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TrainingList);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Ganar masa muscular');
    expect(compiled.textContent).toContain('Push / pull / legs');
    expect(compiled.textContent).toContain('Completado');
  });

  it('should disable pagination when there are no trainings', async () => {
    const trainingApiMock = {
      getTrainings: () =>
        of({
          data: [],
          pagination: {
            page: 1,
            limit: 6,
            total: 0,
            totalPages: 0,
          },
        }),
      deleteTraining: () => of(void 0),
    };

    await TestBed.configureTestingModule({
      imports: [TrainingList],
      providers: [
        provideRouter([]),
        { provide: TrainingApiService, useValue: trainingApiMock },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TrainingList);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    const previousButton = buttons[0] as HTMLButtonElement;
    const nextButton = buttons[1] as HTMLButtonElement;

    expect(previousButton.disabled).toBe(true);
    expect(nextButton.disabled).toBe(true);
  });
});
