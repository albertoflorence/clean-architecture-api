export interface UniqueValidator {
  isUnique: (filter: any) => Promise<boolean>
}
