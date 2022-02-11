import { AddSurveyRepository, LoadSurveysRepository } from '@/data/protocols'
import { SurveyModel } from '@/domain/models'
import { AddSurveyModel } from '@/domain/usecases'
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

  async add(data: AddSurveyModel): Promise<void> {
    await this.collection.insertOne(data)
  }

  async load(): Promise<SurveyModel[]> {
    const surveys = await this.collection.find().toArray()
    return this.mapCollection(surveys)
  }
}
