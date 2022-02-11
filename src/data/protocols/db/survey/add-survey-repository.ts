import { AddSurveyModel } from '@/domain/usecases'

export interface AddSurveyRepository {
  add: (data: AddSurveyModel) => Promise<void>
}
