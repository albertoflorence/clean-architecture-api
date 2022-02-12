import { UniqueValidator } from '@/validation/protocols'

export class UniqueValidatorStub implements UniqueValidator {
  result: boolean = true
  filter: any = undefined
  async isUnique(filter: any): Promise<boolean> {
    this.filter = filter
    return this.result
  }
}
