import { InvalidParamError } from '../presentation/errors'
import { Validation } from '../presentation/protocols'
import { EmailValidator } from '../utils/emailValidator'

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
