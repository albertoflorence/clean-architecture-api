import { DbAddSurvey } from '@/data/usecases'
import { AddSurvey } from '@/domain/usecases'
import { SurveyMongoRepository } from '@/infra/db'

export const makeDbAddSurvey = (): AddSurvey =>
  new DbAddSurvey(new SurveyMongoRepository())
