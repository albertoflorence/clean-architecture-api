import { UniqueValidator } from '.'
import { UniqueParamError } from '../presentation/errors'
import { UniqueFieldValidation } from './unique-field-validation'

class UniqueValidatorStub implements UniqueValidator {
  isUnique = async (filter: any): Promise<boolean> => true
}

interface SutTypes {
  sut: UniqueFieldValidation
  uniqueValidatorStub: UniqueValidator
}

const makeSut = (): SutTypes => {
  const uniqueValidatorStub = new UniqueValidatorStub()
  const sut = new UniqueFieldValidation('field', uniqueValidatorStub)
  return { sut, uniqueValidatorStub }
}

describe('Unique Field Validation', () => {
  it('Should return null if UniqueValidator return true', async () => {
    const { sut } = makeSut()
    const validation = await sut.validate('any_value')
    expect(validation).toBe(null)
  })

  it('Should return UniquePararmError if UniqueValidator return false', async () => {
    const { sut, uniqueValidatorStub } = makeSut()
    jest
      .spyOn(uniqueValidatorStub, 'isUnique')
      .mockReturnValue(Promise.resolve(false))
    const validation = await sut.validate('any_value')

    expect(validation).toEqual(new UniqueParamError('field'))
  })
})
