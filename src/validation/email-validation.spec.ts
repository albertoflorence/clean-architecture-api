import { InvalidParamError } from '../presentation/errors'
import { EmailValidator } from '../utils/emailValidator'
import { EmailValidation } from './email-validation'

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

class EmailValidatorStub implements EmailValidator {
  isValid = (email: string): boolean => true
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new EmailValidation(emailValidatorStub)
  return { sut, emailValidatorStub }
}

describe('Email Validation', () => {
  it('Should return an InvalidParam error if EmailValidator return false', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest
      .spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce(() => false)
    const validation = sut.validate('invalid_mail@mail.com')
    expect(validation).toEqual(new InvalidParamError('email'))
  })

  it('Should return false if an valid email is provided', () => {
    const { sut } = makeSut()
    const validation = sut.validate('valid_mail.com')
    expect(validation).toBeFalsy()
  })
})
