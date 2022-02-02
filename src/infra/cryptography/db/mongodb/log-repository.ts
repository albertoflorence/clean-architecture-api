import { LogErrorRepository } from '../../../../data/protocols/log-error-repository'

export class LogErrorMongoRepository implements LogErrorRepository {
  saveLog = async (stack: string): Promise<void> => {
    return await Promise.resolve()
  }
}
