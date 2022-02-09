import { AddSurveyController } from '../../../../presentation/controllers/survey/add-survey-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeDbAddSurvey } from '../../usecases/add-survey-factory'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

export const makeAddSurveyController = (): Controller =>
  makeLogControllerDecorator(
    new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())
  )
