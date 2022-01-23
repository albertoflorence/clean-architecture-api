export interface EmailValidator {
  isValid: (email: string) => boolean
}

export interface Validator {
  isEmail: (email: string) => boolean
}
