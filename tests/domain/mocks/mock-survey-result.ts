import { SurveyModel, SurveyResultModel } from '@/domain/models'
import { AddSurveyResult } from '@/domain/usecases'

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
      count: 1,
      percent: 50
    },
    {
      answer: 'other_answer',
      count: 1,
      percent: 50
    }
  ],
  date: fakeDate
})

export const makeEmptySurveyResult = (
  survey: SurveyModel
): SurveyResultModel => ({
  question: survey.question,
  surveyId: survey.id,
  date: survey.date,
  answers: survey.answers.map(answer => ({
    ...answer,
    count: 0,
    percent: 0
  }))
})
