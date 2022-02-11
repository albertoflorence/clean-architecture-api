import { Validation, ValidationAsync } from '@/presentation/protocols'

export class ValidationCompositeAsync implements ValidationAsync {
  constructor(
    private readonly validations: Array<ValidationAsync | Validation>
  ) {}

  async validate(input: any): Promise<Error | null> {
    for (const validation of this.validations) {
      const error = await validation.validate(input)
      if (error) return error
    }
    return null
  }
}
