import { AddSurveyResultRepository } from '@/data/protocols'
import { Collection } from 'mongodb'
import { MongoDbHelper } from '@/infra/db'

export class SurveyResultMongoRepository implements AddSurveyResultRepository {
  async add(
    data: AddSurveyResultRepository.Params
  ): AddSurveyResultRepository.Result {
    const { surveyId, accountId, answer, date, question } = data
    const result = await this.collection.findOneAndUpdate(
      { surveyId, accountId },
      { $set: { answer, date, question } },
      { upsert: true, returnDocument: 'after' }
    )
    return result && this.map(result.value)
  }

  private get collection(): Collection {
    return MongoDbHelper.getCollection('surveyResults')
  }

  private map(data: any): any {
    return MongoDbHelper.map(data)
  }
}
