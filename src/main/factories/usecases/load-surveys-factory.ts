import { DbLoadSurveys } from '../../../data/usecases'
import { SurveyMongoRepository } from '../../../infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveys = (): DbLoadSurveys =>
  new DbLoadSurveys(new SurveyMongoRepository())
