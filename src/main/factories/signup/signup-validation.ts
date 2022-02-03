import { Validation } from '../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../utils/emailValidator/email-validator-adapter'
import { EmailValidation } from '../../../validation/email-validation'
import { CompareFieldsValidation } from '../../../validation/compare-fields-validation'
import { RequireFieldValidation } from '../../../validation/require-field-validation'
import { ValidationComposite } from '../../../validation/validation-composite'

export const makeSignUpValidation = (): Validation => {
  const validations: Validation[] = [
    new RequireFieldValidation('name', 'email', 'password', 'passwordConfirm'),
    new CompareFieldsValidation('password', 'passwordConfirm'),
    new EmailValidation('email', new EmailValidatorAdapter())
  ]

  return new ValidationComposite(validations)
}
