import { LoadSurveysController } from '../../../../presentation/controllers/survey/load-survey-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeDbLoadSurveys } from '../../usecases/load-surveys-factory'

export const makeLoadSurveysController = (): Controller =>
  makeLogControllerDecorator(new LoadSurveysController(makeDbLoadSurveys()))
