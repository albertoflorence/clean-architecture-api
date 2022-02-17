import { LoadSurveyResultController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import {
  makeLogControllerDecorator,
  makeDbLoadSurveyById,
  makeDbLoadSurveyResult
} from '@/main/factories'

export const makeLoadSurveyResultController = (): Controller =>
  makeLogControllerDecorator(
    new LoadSurveyResultController(
      makeDbLoadSurveyById(),
      makeDbLoadSurveyResult()
    )
  )
