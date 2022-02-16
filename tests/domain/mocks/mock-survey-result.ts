import { SurveyResultModel } from '../models'
import { AddSurveyResult } from '../usecases'

const fakeDate = new Date()
export const mockAddSurveyResultParams = (): AddSurveyResult.Params => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: fakeDate
})

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  question: 'any_question',
  answers: [
    {
      answer: 'any_answer',
      count: 2,
      percent: 50
    }
  ],
  date: fakeDate
})
