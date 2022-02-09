import { Validation } from '../../../../presentation/protocols'
import {
  RequireFieldValidation,
  ValidationComposite
} from '../../../../validation'

export const makeAddSurveyValidation = (): Validation => {
  const validations = [new RequireFieldValidation('question', 'answers')]
  return new ValidationComposite(validations)
}
