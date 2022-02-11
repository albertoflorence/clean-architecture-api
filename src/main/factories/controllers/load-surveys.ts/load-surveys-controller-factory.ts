import { LoadSurveysController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator, makeDbLoadSurveys } from '@/main/factories'

export const makeLoadSurveysController = (): Controller =>
  makeLogControllerDecorator(new LoadSurveysController(makeDbLoadSurveys()))
