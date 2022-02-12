import { InvalidParamError } from '@/presentation/errors'
import { EmailValidation } from '@/validation/validators'
import { EmailValidatorStub } from '@/tests/validation/mocks'

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidatorStub
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
    emailValidatorStub.result = false
    const validation = sut.validate(makeInput())
    expect(validation).toEqual(new InvalidParamError('email'))
  })

  it('Should return null if validation succeeds', () => {
    const { sut } = makeSut()
    const validation = sut.validate(makeInput())
    expect(validation).toBe(null)
  })
})
