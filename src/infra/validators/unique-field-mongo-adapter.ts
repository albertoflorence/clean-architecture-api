import { UniqueValidator } from '@/validation/protocols'
import { Collection } from 'mongodb'
import { MongoDbHelper } from '@/infra/db'

export class UniqueFieldMongoAdapter implements UniqueValidator {
  constructor(private readonly collectionName: string) {}

  get collection(): Collection {
    return MongoDbHelper.getCollection(this.collectionName)
  }

  async isUnique(filter: Object): Promise<boolean> {
    const document = await this.collection.findOne(filter)
    return document === null
  }
}
