import { MissingParamError } from '../presentation/errors'
import { RequireFieldValidation } from './require-field-validation'

const makeSut = (): RequireFieldValidation => {
  return new RequireFieldValidation('field')
}

describe('Require Field Validation', () => {
  it('Should return an MissingParamError if validation fails', () => {
    const sut = makeSut()
    const validation = sut.validate({ invalidField: 'any' })
    expect(validation).toEqual(new MissingParamError('field'))
  })

  it('Should return null if validation succeeds', () => {
    const sut = makeSut()
    const validation = sut.validate({ field: 'any' })
    expect(validation).toBe(null)
  })
})
