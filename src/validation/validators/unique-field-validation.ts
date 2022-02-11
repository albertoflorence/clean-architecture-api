import { UniqueValidator } from '@/validation/protocols'
import { UniqueParamError } from '@/presentation/errors'
import { ValidationAsync } from '@/presentation/protocols'

export class UniqueFieldValidation implements ValidationAsync {
  constructor(
    private readonly paramName: string,
    private readonly uniqueValidator: UniqueValidator
  ) {}

  async validate(input: any): Promise<Error | null> {
    return (await this.uniqueValidator.isUnique({
      [this.paramName]: input[this.paramName]
    }))
      ? null
      : new UniqueParamError(this.paramName)
  }
}
