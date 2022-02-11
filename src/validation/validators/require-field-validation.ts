import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols'

export class RequireFieldValidation implements Validation {
  private readonly params: string[] = []

  constructor(...params: string[]) {
    this.params = params
  }

  validate(input: Object): Error | null {
    const missingParam = this.params.find(param => !(param in input))

    return missingParam ? new MissingParamError(missingParam) : null
  }
}
