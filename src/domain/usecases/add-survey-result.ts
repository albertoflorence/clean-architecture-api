import { SurveyResultModel } from '../models'

export interface AddSurveyResult {
  add: (data: AddSurveyResult.Params) => Promise<AddSurveyResult.Result>
}

export namespace AddSurveyResult {
  export interface Params {
    surveyId: string
    accountId: string
    question: string
    answers: string
    date: Date
  }
  export type Result = Promise<SurveyResultModel>
}
