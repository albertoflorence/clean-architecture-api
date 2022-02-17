import { ObjectId } from 'mongodb'
import { MongoDbHelper } from '@/infra/db'
import { AddSurveyResultRepository } from '@/data/protocols'
import { AccountModel, SurveyModel } from '@/domain/models'
import { mockMongoAccount, mockMongoSurvey } from '@/tests/infra/db'

export const mockMongoSurveyResult = async (
  surveyResultAddParams: AddSurveyResultRepository.Params[]
): Promise<void> => {
  const collection = MongoDbHelper.getCollection('surveyResults')

  await collection.insertMany(surveyResultAddParams.map(stringToObjectId))
}

export const mockSurveyResultParams = async (
  survey?: SurveyModel,
  account?: AccountModel,
  answerIndex: number = 0
): Promise<AddSurveyResultRepository.Params> => {
  if (!account) account = await mockMongoAccount()
  if (!survey) survey = await mockMongoSurvey()

  return {
    accountId: account.id,
    surveyId: survey.id,
    answer: survey.answers[answerIndex].answer,
    date: new Date()
  }
}

export const findSurveyResult = async (
  surveyParams: AddSurveyResultRepository.Params
): Promise<any> => {
  const collection = MongoDbHelper.getCollection('surveyResults')

  return await collection.findOne(stringToObjectId(surveyParams))
}

const stringToObjectId = (
  params: AddSurveyResultRepository.Params
): object => ({
  ...params,
  surveyId: new ObjectId(params.surveyId),
  accountId: new ObjectId(params.accountId)
})
