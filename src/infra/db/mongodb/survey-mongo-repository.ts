import {
  AddSurveyRepository,
  LoadSurveysRepository,
  LoadSurveyByIdRepository
} from '@/data/protocols'
import { Collection, ObjectId } from 'mongodb'
import { MongoDbHelper } from '@/infra/db'

export class SurveyMongoRepository
  implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository
{
  async add(data: AddSurveyRepository.Params): AddSurveyRepository.Result {
    await this.collection.insertOne(data)
  }

  async load(): LoadSurveysRepository.Result {
    const surveys = await this.collection.find().toArray()
    return this.mapCollection(surveys)
  }

  async loadById(id: string): LoadSurveyByIdRepository.Result {
    const survey = await this.collection.findOne({ _id: new ObjectId(id) })
    return survey && this.map(survey)
  }

  private get collection(): Collection {
    return MongoDbHelper.getCollection('surveys')
  }

  private mapCollection(collection: any[]): any {
    return MongoDbHelper.mapCollection(collection)
  }

  private map(data: any): any {
    return MongoDbHelper.map(data)
  }
}
