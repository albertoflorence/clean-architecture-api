import { DbLoadSurveys } from '@/data/usecases'
import { SurveyMongoRepository } from '@/infra/db'

export const makeDbLoadSurveys = (): DbLoadSurveys =>
  new DbLoadSurveys(new SurveyMongoRepository())
