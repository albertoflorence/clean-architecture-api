import { UniqueFieldMongoAdapter } from '@/infra/validators/unique-field-mongo-adapter'
import { Validation, ValidationAsync } from '@/presentation/protocols'
import { EmailValidator } from '@/validation/protocols'
import {
  RequireFieldValidation,
  CompareFieldsValidation,
  EmailValidation,
  ValidationCompositeAsync,
  UniqueFieldValidation
} from '@/validation/validators'

import { makeSignUpValidation } from './signup-validation-factory'

jest.mock('@/validation/validators/validation-composite-async')

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignUpValidation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Array<Validation | ValidationAsync> = [
      new RequireFieldValidation(
        'name',
        'email',
        'password',
        'passwordConfirm'
      ),
      new CompareFieldsValidation('password', 'passwordConfirm'),
      new EmailValidation('email', makeEmailValidatorStub()),
      new UniqueFieldValidation(
        'email',
        new UniqueFieldMongoAdapter('accounts')
      )
    ]

    expect(ValidationCompositeAsync).toHaveBeenCalledWith(validations)
  })
})
