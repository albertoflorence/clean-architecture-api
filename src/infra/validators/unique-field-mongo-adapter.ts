import { UniqueValidator } from '../../validation'
import { Collection, MongoDbHelper } from '../db/mongodb/helpers/mongo-helper'

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
