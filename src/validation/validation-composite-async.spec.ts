import { InvalidParamError } from '../presentation/errors'
import { Validation, ValidationAsync } from '../presentation/protocols'
import { ValidationCompositeAsync } from './validation-composite-async'

interface SutTypes {
  sut: ValidationCompositeAsync
  validations: Array<Validation | ValidationAsync>
}

class ValidationStub implements Validation {
  validate = (input: any): Error | null => {
    return null
  }
}
class ValidationAsyncStub implements ValidationAsync {
  validate = async (input: any): Promise<Error | null> => {
    return null
  }
}

const makeSut = (): SutTypes => {
  const validations = [new ValidationStub(), new ValidationAsyncStub()]
  const sut = new ValidationCompositeAsync(validations)
  return { sut, validations }
}
describe('Validation Composite', () => {
  it('Should return error if any validation fails', async () => {
    const { sut, validations } = makeSut()

    jest
      .spyOn(validations[0], 'validate')
      .mockImplementationOnce(() => new Error())

    const validation = await sut.validate({})
    expect(validation).toEqual(new Error())
  })

  it('Should return the first error if more than one validation fails', async () => {
    const { sut, validations } = makeSut()

    jest
      .spyOn(validations[0], 'validate')
      .mockReturnValueOnce(Promise.resolve(new InvalidParamError('field')))

    jest
      .spyOn(validations[1], 'validate')
      .mockImplementationOnce(() => new Error())

    const validation = await sut.validate({})
    expect(validation).toEqual(new InvalidParamError('field'))
  })

  it('Should return null if no validations fails', async () => {
    const { sut } = makeSut()

    const validation = await sut.validate({})
    expect(validation).toBe(null)
  })
})
