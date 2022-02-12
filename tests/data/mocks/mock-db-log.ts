import { LogErrorRepository } from '@/data/protocols'

export class LogErrorRepositoryStub implements LogErrorRepository {
  stack: string = ''
  saveLog = async (stack: string): Promise<void> => {
    this.stack = stack
  }
}
