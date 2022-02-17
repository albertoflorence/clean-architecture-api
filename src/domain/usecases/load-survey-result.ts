import { SurveyResultModel } from '@/domain/models'

export interface LoadSurveyResult {
  load: (surveyId: string) => LoadSurveyResult.Result
}

export namespace LoadSurveyResult {
  export type Result = Promise<SurveyResultModel>
}
