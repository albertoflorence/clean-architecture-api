export interface Validation {
  validate: (input: any) => Error | null
}

export interface ValidationAsync {
  validate: (input: any) => Promise<Error | null>
}
