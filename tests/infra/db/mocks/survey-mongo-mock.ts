import { mockAddSurveyParams } from '@/tests/domain/mocks'
import { SurveyModel } from '@/domain/models'
import { MongoDbHelper } from '@/infra/db'

export const mockMongoSurvey = async (): Promise<SurveyModel> => {
  const collection = MongoDbHelper.getCollection('surveys')
  const document = await collection.insertOne(mockAddSurveyParams())
  const survey = await collection.findOne({ _id: document.insertedId })
  return MongoDbHelper.map(survey)
}
