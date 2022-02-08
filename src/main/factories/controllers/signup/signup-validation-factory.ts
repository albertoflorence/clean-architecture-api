import { EmailValidatorAdapter } from '../../../../infra/validators'
import { UniqueFieldMongoAdapter } from '../../../../infra/validators/unique-field-mongo-adapter'
import {
  CompareFieldsValidation,
  EmailValidation,
  RequireFieldValidation,
  Validation,
  UniqueFieldValidation,
  ValidationAsync,
  ValidationCompositeAsync
} from '../../../../validation'

export const makeSignUpValidation = (): ValidationAsync => {
  const validations: Array<Validation | ValidationAsync> = [
    new RequireFieldValidation('name', 'email', 'password', 'passwordConfirm'),
    new CompareFieldsValidation('password', 'passwordConfirm'),
    new EmailValidation('email', new EmailValidatorAdapter()),
    new UniqueFieldValidation('email', new UniqueFieldMongoAdapter('accounts'))
  ]

  return new ValidationCompositeAsync(validations)
}
