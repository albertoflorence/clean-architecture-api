import { EmailValidatorAdapter } from './emailValidator'
import { Validator } from './protocols'

interface SutTypes {
  sut: EmailValidatorAdapter
  validatorStub: Validator
}

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    isEmail = (email: string): boolean => true
  }
  return new ValidatorStub()
}
const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const sut = new EmailValidatorAdapter(validatorStub)
  return { sut, validatorStub }
}
describe('EmailValidator Adaptar', () => {
  it('Should return false if validator returns false', () => {
    const { sut, validatorStub } = makeSut()

    jest
      .spyOn(validatorStub, 'isEmail')
      .mockImplementationOnce((email: string) => false)

    const isValid = sut.isValid('invalid@mail.com')
    expect(isValid).toBe(false)
  })
  it('Should return true if validator return true', () => {
    const { sut } = makeSut()

    const isValid = sut.isValid('valid@mail.com')
    expect(isValid).toBe(true)
  })
})
