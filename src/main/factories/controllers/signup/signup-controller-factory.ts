import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeDbAddAccount } from '../../usecases/add-account-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeSignUpController = (): Controller =>
  makeLogControllerDecorator(
    new SignUpController(makeDbAddAccount(), makeSignUpValidation())
  )
