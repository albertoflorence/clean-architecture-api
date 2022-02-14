import { AddSurvey } from '@/domain/usecases'
import { AddSurveyRepository } from '@/data/protocols'

export class DbAddSurvey implements AddSurvey {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) {}
  async add(data: AddSurvey.Params): AddSurvey.Result {
    await this.addSurveyRepository.add(data)
  }
}
