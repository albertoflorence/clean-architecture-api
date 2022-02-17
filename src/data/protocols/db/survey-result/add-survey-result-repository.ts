import { AddSurveyResult } from '@/domain/usecases'

export interface AddSurveyResultRepository {
  add: (
    data: AddSurveyResultRepository.Params
  ) => AddSurveyResultRepository.Result
}

export namespace AddSurveyResultRepository {
  export type Params = AddSurveyResult.Params
  export type Result = Promise<void>
}
