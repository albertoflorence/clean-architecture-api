import { InvalidParamError } from '../presentation/errors'
import { Validation } from '../presentation/protocols'
import { ValidationComposite } from './validation-composite'

interface SutTypes {
  sut: ValidationComposite
  validations: Validation[]
}

class ValidationStub implements Validation {
  validate = (input: any): Error | null => {
    return null
  }
}

const makeSut = (): SutTypes => {
  const validations = [new ValidationStub(), new ValidationStub()]
  const sut = new ValidationComposite(validations)
  return { sut, validations }
}
describe('Validation Composite', () => {
  it('Should return error if any validation fails', () => {
    const { sut, validations } = makeSut()

    jest
      .spyOn(validations[0], 'validate')
      .mockImplementationOnce(() => new Error())

    const validation = sut.validate({})
    expect(validation).toEqual(new Error())
  })

  it('Should return the first error if more than one validation fails', () => {
    const { sut, validations } = makeSut()

    jest
      .spyOn(validations[0], 'validate')
      .mockImplementationOnce(() => new InvalidParamError('field'))

    jest
      .spyOn(validations[1], 'validate')
      .mockImplementationOnce(() => new Error())

    const validation = sut.validate({})
    expect(validation).toEqual(new InvalidParamError('field'))
  })

  it('Should return false if no validations fails', () => {
    const { sut } = makeSut()

    const validation = sut.validate({})
    expect(validation).toBeFalsy()
  })
})
