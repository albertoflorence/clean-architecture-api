import { EmailValidatorAdapter } from '../../../../infra/validators'
import {
  CompareFieldsValidation,
  EmailValidation,
  RequireFieldValidation,
  Validation,
  ValidationComposite
} from '../../../../validation'

export const makeSignUpValidation = (): Validation => {
  const validations: Validation[] = [
    new RequireFieldValidation('name', 'email', 'password', 'passwordConfirm'),
    new CompareFieldsValidation('password', 'passwordConfirm'),
    new EmailValidation('email', new EmailValidatorAdapter())
  ]

  return new ValidationComposite(validations)
}
