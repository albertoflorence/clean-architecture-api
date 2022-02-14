import { AddSurveyResultRepository } from '@/data/protocols'
import { Collection } from 'mongodb'
import { MongoDbHelper } from '@/infra/db'

export class SurveyResultMongoRepository implements AddSurveyResultRepository {
  async add(
    data: AddSurveyResultRepository.Params
  ): AddSurveyResultRepository.Result {
    const document = await this.collection.insertOne(data)
    const result = await this.collection.findOne({ _id: document.insertedId })
    return result && this.map(result)
  }

  private get collection(): Collection {
    return MongoDbHelper.getCollection('surveys')
  }

  private map(data: any): any {
    return MongoDbHelper.map(data)
  }
}
