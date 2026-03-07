import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  GenerateTrainingRequest,
  GenerateTrainingResponse,
  HealthResponse,
  TrainingDetailResponse,
  TrainingListResponse
} from './training-api.models';


@Injectable({ providedIn: 'root' })
export class TrainingApiService {
  private readonly baseUrl = '/api/trainings';

  constructor(private readonly http: HttpClient) {}

  health(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.baseUrl}/health`);
  }

  getTrainings(page = 1, limit = 20): Observable<TrainingListResponse> {
    const params = new HttpParams()
    .set('page', String(page))
    .set('limit', String(limit));

    return this.http.get<TrainingListResponse>(`${this.baseUrl}`, { params });
  }

  generateTraining(payload: GenerateTrainingRequest): Observable<GenerateTrainingResponse> {
    return this.http.post<GenerateTrainingResponse>(`${this.baseUrl}/generate`, payload);
  }

  getTrainingById(id: string): Observable<TrainingDetailResponse> {
    return this.http.get<TrainingDetailResponse>(`${this.baseUrl}/${id}`);
  }

  regenerateTraining(id: string): Observable<GenerateTrainingResponse> {
    return this.http.put<GenerateTrainingResponse>(`${this.baseUrl}/${id}`, {});
  }

  deleteTraining(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}
