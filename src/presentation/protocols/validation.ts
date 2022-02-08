export interface Validation {
  validate: (input: any) => Error | null
}

export interface ValidationAsync {
  validate: (input: any) => Promise<Error | null>
}

export interface EmailValidator {
  isValid: (email: string) => boolean
}

export interface UniqueValidator {
  isUnique: (filter: any) => Promise<boolean>
}
