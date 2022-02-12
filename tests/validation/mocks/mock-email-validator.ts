import { EmailValidator } from '@/validation/protocols'

export class EmailValidatorStub implements EmailValidator {
  result: boolean = true
  email: string = ''
  isValid = (email: string): boolean => {
    this.email = email
    return this.result
  }
}
