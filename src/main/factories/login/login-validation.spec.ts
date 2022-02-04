import { Validation } from '../../../presentation/protocols'
import { EmailValidator } from '../../../utils/emailValidator'
import {
  EmailValidation,
  RequireFieldValidation,
  ValidationComposite
} from '../../../validation'

import { makeLoginValidation } from './login-validation'

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
    makeLoginValidation()
    const validations: Validation[] = [
      new RequireFieldValidation('email', 'password'),
      new EmailValidation('email', makeEmailValidatorStub())
    ]

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
