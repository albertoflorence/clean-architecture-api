import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository'
import { LoadSurveysRepository } from '../../../../data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '../../../../domain/models/survey'
import { AddSurveyModel } from '../../../../domain/usecases'
import { Collection, MongoDbHelper } from '../helpers/mongo-helper'

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
