import { UniqueParamError } from '@/presentation/errors'
import { UniqueFieldValidation } from '@/validation/validators'
import { UniqueValidatorStub } from '@/tests/validation/mocks'

interface SutTypes {
  sut: UniqueFieldValidation
  uniqueValidatorStub: UniqueValidatorStub
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

  it('Should return UniqueParamError if UniqueValidator return false', async () => {
    const { sut, uniqueValidatorStub } = makeSut()
    uniqueValidatorStub.result = false
    const validation = await sut.validate('any_value')
    expect(validation).toEqual(new UniqueParamError('field'))
  })
})
