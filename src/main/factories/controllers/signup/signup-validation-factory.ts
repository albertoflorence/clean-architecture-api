import { EmailValidatorAdapter } from '@/infra/validators'
import { UniqueFieldMongoAdapter } from '@/infra/validators/unique-field-mongo-adapter'
import { ValidationAsync, Validation } from '@/presentation/protocols'
import {
  CompareFieldsValidation,
  EmailValidation,
  RequireFieldValidation,
  UniqueFieldValidation,
  ValidationCompositeAsync
} from '@/validation/validators'

export const makeSignUpValidation = (): ValidationAsync => {
  const validations: Array<Validation | ValidationAsync> = [
    new RequireFieldValidation('name', 'email', 'password', 'passwordConfirm'),
    new CompareFieldsValidation('password', 'passwordConfirm'),
    new EmailValidation('email', new EmailValidatorAdapter()),
    new UniqueFieldValidation('email', new UniqueFieldMongoAdapter('accounts'))
  ]

  return new ValidationCompositeAsync(validations)
}
