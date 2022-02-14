import { LoadSurveys } from '@/domain/usecases'

export interface LoadSurveysRepository {
  load: () => LoadSurveysRepository.Result
}

export namespace LoadSurveysRepository {
  export type Result = LoadSurveys.Result
}
