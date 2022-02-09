import {
  Controller,
  LoginController
} from '../../../../presentation/controllers/login/login-controller-protocols'
import { makeLoginValidation } from './login-validation-factory'
import { makeDbAuthentication } from '../../usecases/authentication-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeLoginController = (): Controller =>
  makeLogControllerDecorator(
    new LoginController(makeLoginValidation(), makeDbAuthentication())
  )
