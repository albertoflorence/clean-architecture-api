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
  const sut = new EmailValidation('field', emailValidatorStub)
  return { sut, emailValidatorStub }
}

interface InputType {
  field: string
}

const makeInput = (): InputType => ({
  field: 'any_mail@mail.com'
})

describe('Email Validation', () => {
  it('Should return an InvalidParam error if EmailValidator return false', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest
      .spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce(() => false)

    const validation = sut.validate(makeInput())
    expect(validation).toEqual(new InvalidParamError('email'))
  })

  it('Should return null if validation succeeds', () => {
    const { sut } = makeSut()
    const validation = sut.validate(makeInput())
    expect(validation).toBe(null)
  })
})
