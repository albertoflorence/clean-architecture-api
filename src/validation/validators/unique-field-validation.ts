import { UniqueValidator } from '../'
import { UniqueParamError } from '../../presentation/errors'
import { ValidationAsync } from '../../presentation/protocols'

export class UniqueFieldValidation implements ValidationAsync {
  constructor(
    private readonly paramName: string,
    private readonly uniqueValidator: UniqueValidator
  ) {}

  async validate(input: any): Promise<Error | null> {
    return (await this.uniqueValidator.isUnique(input))
      ? null
      : new UniqueParamError(this.paramName)
  }
}
