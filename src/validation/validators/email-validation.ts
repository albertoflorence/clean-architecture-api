import { InvalidParamError } from '@/presentation/errors'
import { EmailValidator } from '@/validation/protocols'
import { Validation } from '@/presentation/protocols'

export class EmailValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate(input: any): Error | null {
    return this.emailValidator.isValid(input[this.fieldName])
      ? null
      : new InvalidParamError('email')
  }
}
