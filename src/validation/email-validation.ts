import { InvalidParamError } from '../presentation/errors'
import { Validation } from '../presentation/protocols'
import { EmailValidator } from '../utils/emailValidator'

export class EmailValidation implements Validation {
  constructor(private readonly emailValidator: EmailValidator) {}

  validate(email: string): false | Error {
    return this.emailValidator.isValid(email)
      ? false
      : new InvalidParamError('email')
  }
}
