import {
  RequireFieldValidation,
  CompareFieldsValidation,
  EmailValidation,
  ValidationComposite,
  EmailValidator,
  Validation
} from '../../../validation'
import { makeSignUpValidation } from './signup-validation-factory'

jest.mock('../../../validation/validation-composite')

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
    const validations: Validation[] = [
      new RequireFieldValidation(
        'name',
        'email',
        'password',
        'passwordConfirm'
      ),
      new CompareFieldsValidation('password', 'passwordConfirm'),
      new EmailValidation('email', makeEmailValidatorStub())
    ]

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
