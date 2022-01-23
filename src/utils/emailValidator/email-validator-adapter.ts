import { EmailValidator, Validator } from './protocols'
import defaultValidator from 'validator'

export class EmailValidatorAdapter implements EmailValidator {
  constructor(private readonly validator: Validator = defaultValidator) {}
  isValid(email: string): boolean {
    return this.validator.isEmail(email)
  }
}
