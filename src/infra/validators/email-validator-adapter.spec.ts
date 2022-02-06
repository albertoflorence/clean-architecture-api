import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail: (str: string): boolean => true
}))

interface SutTypes {
  sut: EmailValidatorAdapter
}

const makeSut = (): SutTypes => {
  const sut = new EmailValidatorAdapter()
  return { sut }
}
describe('EmailValidator Adaptar', () => {
  it('Should return false if validator returns false', () => {
    const { sut } = makeSut()

    jest
      .spyOn(validator, 'isEmail')
      .mockImplementationOnce((email: string) => false)

    const isValid = sut.isValid('invalid@mail.com')
    expect(isValid).toBe(false)
  })

  it('Should return true if validator return true', () => {
    const { sut } = makeSut()
    const isValid = sut.isValid('valid@mail.com')
    expect(isValid).toBe(true)
  })

  it('Should call isEmail with correct email', () => {
    const { sut } = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('any@mail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('any@mail.com')
  })
})
