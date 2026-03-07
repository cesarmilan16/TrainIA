export type TrainingSplit = 'fullbody' | 'upper_lower' | 'push_pull_legs' | 'weider';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type Equipment = 'gym' | 'home_dumbbells' | 'calisthenics';
export type TrainingStatus = 'GENERATING' | 'COMPLETED' | 'FAILED';

export interface GenerateTrainingRequest {
    goal: string;
    daysPerWeek: number;
    trainingSplit: TrainingSplit;
    experienceLevel: ExperienceLevel;
    equipment: Equipment;
}

export interface GenerateTrainingResponse {
    id: string;
    status: TrainingStatus;
}

export interface HealthResponse {
    status: string;
}

export interface TrainingListItem {
    id: string;
    goal: string;
    daysPerWeek: number;
    trainingSplit: TrainingSplit;
    experienceLevel: ExperienceLevel;
    equipment: Equipment;
    status: TrainingStatus;
    createdAt: string;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface TrainingListResponse {
    data: TrainingListItem[];
    pagination: Pagination;
}

export interface TrainingInput {
    goal: string;
    daysPerWeek: number;
    trainingSplit: TrainingSplit;
    experienceLevel: ExperienceLevel;
    equipment: Equipment;
}

export interface TrainingDetailResponse {
    id: string;
    status: TrainingStatus;
    createdAt: string;
    input: TrainingInput;
    training?: unknown;
}

export interface ApiValidationErrorItem {
    field?: string;
    message: string;
}

export interface ApiValidationErrorResponse {
    errors: ApiValidationErrorItem[];
}

export interface ApiErrorResponse {
    error: string;
    detalle?: string;
}
