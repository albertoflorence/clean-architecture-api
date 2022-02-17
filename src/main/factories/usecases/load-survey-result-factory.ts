import { DbLoadSurveyResult } from '@/data/usecases'
import { LoadSurveyResult } from '@/domain/usecases'
import { SurveyResultMongoRepository } from '@/infra/db'
import { makeDbLoadSurveyById } from '@/main/factories'

export const makeDbLoadSurveyResult = (): LoadSurveyResult =>
  new DbLoadSurveyResult(
    new SurveyResultMongoRepository(),
    makeDbLoadSurveyById()
  )
