import { SurveyModel } from '@/domain/models'

export interface LoadSurveysRepository {
  load: () => Promise<SurveyModel[]>
}
