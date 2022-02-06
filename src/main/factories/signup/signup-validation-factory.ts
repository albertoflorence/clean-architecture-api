import { Validation } from '../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../utils/emailValidator/email-validator-adapter'
import {
  RequireFieldValidation,
  CompareFieldsValidation,
  EmailValidation,
  ValidationComposite
} from '../../../validation'

export const makeSignUpValidation = (): Validation => {
  const validations: Validation[] = [
    new RequireFieldValidation('name', 'email', 'password', 'passwordConfirm'),
    new CompareFieldsValidation('password', 'passwordConfirm'),
    new EmailValidation('email', new EmailValidatorAdapter())
  ]

  return new ValidationComposite(validations)
}
