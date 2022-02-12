import { Validation, ValidationAsync } from '@/presentation/protocols'

export class ValidationStub implements Validation {
  input: any = null
  result: Error | null = null
  validate(input: any): Error | null {
    this.input = input
    return this.result
  }
}

export class ValidationAsyncStub implements ValidationAsync {
  input: any = null
  result: Error | null = null
  async validate(input: any): Promise<Error | null> {
    this.input = input
    return this.result
  }
}
