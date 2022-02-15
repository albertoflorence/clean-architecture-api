import { AddSurveyResultController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import {
  makeLogControllerDecorator,
  makeDbLoadSurveyById,
  makeDbAddSurveyResult
} from '@/main/factories'

export const makeAddSurveyResultController = (): Controller =>
  makeLogControllerDecorator(
    new AddSurveyResultController(
      makeDbLoadSurveyById(),
      makeDbAddSurveyResult()
    )
  )
