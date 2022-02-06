export interface Validation {
  validate: (input: any) => Error | null
}

export interface EmailValidator {
  isValid: (email: string) => boolean
}
