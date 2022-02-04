import { LogErrorRepository } from '../../../../data/protocols/db/log-error-repository'
import { MongoDbHelper } from '../helpers/mongo-helper'

export class LogErrorMongoRepository implements LogErrorRepository {
  saveLog = async (stack: string): Promise<void> => {
    await MongoDbHelper.getCollection('errors').insertOne({
      stack,
      date: new Date()
    })
  }
}
