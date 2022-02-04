import { Validation } from '../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../utils/emailValidator/email-validator-adapter'
import {
  EmailValidation,
  RequireFieldValidation,
  ValidationComposite
} from '../../../validation'

export const makeLoginValidation = (): Validation => {
  const validations: Validation[] = [
    new RequireFieldValidation('email', 'password'),
    new EmailValidation('email', new EmailValidatorAdapter())
  ]

  return new ValidationComposite(validations)
}
