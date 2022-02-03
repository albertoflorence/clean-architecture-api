import { InvalidParamError } from '../presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

describe('Compare Field Validation', () => {
  it('Should return InvalidParam error if the two fields are not equals', () => {
    const sut = new CompareFieldsValidation('field', 'fieldToCompare')
    const input = {
      field: 'any',
      fieldToCompare: 'not_any'
    }

    const validation = sut.validate(input)
    expect(validation).toEqual(new InvalidParamError('fieldToCompare'))
  })

  it('Should return null if the two field are equals', () => {
    const sut = new CompareFieldsValidation('field', 'fieldToCompare')
    const input = {
      field: 'any',
      fieldToCompare: 'any'
    }

    const validation = sut.validate(input)
    expect(validation).toEqual(null)
  })
})
