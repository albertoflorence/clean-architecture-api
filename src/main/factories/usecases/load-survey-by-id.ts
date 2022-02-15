import { DbLoadSurveyById } from '@/data/usecases'
import { LoadSurveyById } from '@/domain/usecases'
import { SurveyMongoRepository } from '@/infra/db'

export const makeDbLoadSurveyById = (): LoadSurveyById =>
  new DbLoadSurveyById(new SurveyMongoRepository())
