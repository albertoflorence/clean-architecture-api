import { LogErrorRepository } from '@/data/protocols'
import { MongoDbHelper } from '@/infra/db'

export class LogErrorMongoRepository implements LogErrorRepository {
  saveLog = async (stack: string): Promise<void> => {
    await MongoDbHelper.getCollection('errors').insertOne({
      stack,
      date: new Date()
    })
  }
}
