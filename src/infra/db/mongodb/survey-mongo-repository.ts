import { AddSurveyRepository, LoadSurveysRepository } from '@/data/protocols'
import { Collection } from 'mongodb'
import { MongoDbHelper } from '@/infra/db'

export class SurveyMongoRepository
  implements AddSurveyRepository, LoadSurveysRepository
{
  private get collection(): Collection {
    return MongoDbHelper.getCollection('surveys')
  }

  private mapCollection(collection: any[]): any {
    return MongoDbHelper.mapCollection(collection)
  }

  async add(data: AddSurveyRepository.Params): AddSurveyRepository.Result {
    await this.collection.insertOne(data)
  }

  async load(): LoadSurveysRepository.Result {
    const surveys = await this.collection.find().toArray()
    return this.mapCollection(surveys)
  }
}
