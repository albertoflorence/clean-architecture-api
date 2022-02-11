import { LoginController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import {
  makeLogControllerDecorator,
  makeDbAuthentication
} from '@/main/factories'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller =>
  makeLogControllerDecorator(
    new LoginController(makeLoginValidation(), makeDbAuthentication())
  )
