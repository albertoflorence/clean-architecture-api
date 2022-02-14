import { SurveyResultModel } from '../models'
import { AddSurveyResult } from '../usecases'

const fakeDate = new Date()
export const mockAddSurveyResultParams = (): AddSurveyResult.Params => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  question: 'any_question',
  answer: 'any_answer',
  date: fakeDate
})

export const mockSurveyResultModel = (): SurveyResultModel => ({
  id: 'any_id',
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  question: 'any_question',
  answer: 'any_answer',
  date: fakeDate
})
