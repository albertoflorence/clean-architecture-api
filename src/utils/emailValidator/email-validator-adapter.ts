import { EmailValidator, Validator } from './protocols'
export class EmailValidatorAdapter implements EmailValidator {
  constructor(private readonly validator: Validator) {}
  isValid(email: string): boolean {
    return this.validator.isEmail(email)
  }
}
