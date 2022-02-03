import { InvalidParamError } from '../presentation/errors'
import { Validation } from '../presentation/protocols'

export class CompareFieldsValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldNameToCompare: string
  ) {}

  validate(input: any): Error | null {
    return input[this.fieldName] !== input[this.fieldNameToCompare]
      ? new InvalidParamError(this.fieldNameToCompare)
      : null
  }
}
