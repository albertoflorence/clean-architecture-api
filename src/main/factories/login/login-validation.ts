import { Validation } from '../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../utils/emailValidator/email-validator-adapter'
import { EmailValidation } from '../../../validation/email-validation'
import { RequireFieldValidation } from '../../../validation/require-field-validation'
import { ValidationComposite } from '../../../validation/validation-composite'

export const makeLoginValidation = (): Validation => {
  const validations: Validation[] = [
    new RequireFieldValidation('email', 'password'),
    new EmailValidation('email', new EmailValidatorAdapter())
  ]

  return new ValidationComposite(validations)
}
