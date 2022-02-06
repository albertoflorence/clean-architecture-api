import { EmailValidatorAdapter } from '../../../infra/validators'
import {
  EmailValidation,
  RequireFieldValidation,
  ValidationComposite,
  Validation
} from '../../../validation'

export const makeLoginValidation = (): Validation => {
  const validations: Validation[] = [
    new RequireFieldValidation('email', 'password'),
    new EmailValidation('email', new EmailValidatorAdapter())
  ]

  return new ValidationComposite(validations)
}
