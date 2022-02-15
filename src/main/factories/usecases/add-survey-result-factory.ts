import { DbAddSurveyResult } from '@/data/usecases'
import { AddSurveyResult } from '@/domain/usecases'
import { SurveyResultMongoRepository } from '@/infra/db'

export const makeDbAddSurveyResult = (): AddSurveyResult =>
  new DbAddSurveyResult(new SurveyResultMongoRepository())
