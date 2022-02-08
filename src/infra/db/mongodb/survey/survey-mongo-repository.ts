import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository'
import { AddSurveyModel } from '../../../../domain/usecases'
import { Collection, MongoDbHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository {
  get collection(): Collection {
    return MongoDbHelper.getCollection('surveys')
  }

  async add(data: AddSurveyModel): Promise<void> {
    await this.collection.insertOne(data)
  }
}
