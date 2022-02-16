import { MongoDbHelper, SurveyResultMongoRepository } from '@/infra/db'
import { Collection, ObjectId } from 'mongodb'
import { mockMongoAccount, mockMongoSurvey } from '@/tests/infra/db'
import { AddSurveyResultRepository } from '@/data/protocols'

let surveyResultCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

describe('Survey Result Mongo Repository', () => {
  beforeAll(async () => {
    await MongoDbHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoDbHelper.disconnect()
  })

  beforeEach(async () => {
    surveyResultCollection = MongoDbHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    await MongoDbHelper.getCollection('accounts').deleteMany({})
    await MongoDbHelper.getCollection('surveys').deleteMany({})
  })

  describe('add', () => {
    it('Should add a survey result', async () => {
      const sut = makeSut()
      const surveyResultParams = await mockSurveyResultParams()
      await sut.add(surveyResultParams)
      const survey = await findSurveyResult(surveyResultParams)
      expect(survey).toBeTruthy()
    })

    it('Should update the survey result if one already exist', async () => {
      const sut = makeSut()
      const surveyResultParams = await mockSurveyResultParams()
      const updateSurveyResultParams = {
        ...surveyResultParams,
        date: new Date(),
        answer: 'any_answer'
      }
      await sut.add(updateSurveyResultParams)
      const survey = await findSurveyResult(updateSurveyResultParams)
      expect(survey).toBeTruthy()
      expect(await surveyResultCollection.countDocuments()).toBe(1)
    })
  })
})

const mockSurveyResultParams =
  async (): Promise<AddSurveyResultRepository.Params> => {
    const account = await mockMongoAccount()
    const survey = await mockMongoSurvey()
    return {
      accountId: account.id,
      surveyId: survey.id,
      answer: survey.answers[0].answer,
      date: new Date()
    }
  }

const findSurveyResult = async (
  surveyParams: AddSurveyResultRepository.Params
): Promise<any> =>
  await surveyResultCollection.findOne({
    ...surveyParams,
    surveyId: new ObjectId(surveyParams.surveyId),
    accountId: new ObjectId(surveyParams.accountId)
  })
