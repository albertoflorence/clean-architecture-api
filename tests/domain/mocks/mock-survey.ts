import { AddSurvey } from '@/domain/usecases'
import { SurveyModel } from '../models'

const fakeDate = new Date()
export const mockSurveyModel = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [
    {
      answer: 'any_answer'
    },
    {
      answer: 'any_answer',
      image: 'any_answer'
    }
  ],
  date: fakeDate
})

export const mockAddSurveyParams = (): AddSurvey.Params => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    },
    {
      answer: 'any_answer'
    }
  ],
  date: fakeDate
})

export const mockSurveyCollection = (): SurveyModel[] => [
  mockSurveyModel(),
  mockSurveyModel()
]
