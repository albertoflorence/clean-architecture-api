import { SignUpController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator, makeDbAddAccount } from '@/main/factories'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller =>
  makeLogControllerDecorator(
    new SignUpController(makeDbAddAccount(), makeSignUpValidation())
  )
