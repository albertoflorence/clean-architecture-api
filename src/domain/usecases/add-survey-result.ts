import { SurveyResultModel } from '@/domain/models'

export interface AddSurveyResult {
  add: (data: AddSurveyResult.Params) => AddSurveyResult.Result
}

export namespace AddSurveyResult {
  export interface Params {
    surveyId: string
    accountId: string
    answer: string
    date: Date
  }
  export type Result = Promise<SurveyResultModel>
}
