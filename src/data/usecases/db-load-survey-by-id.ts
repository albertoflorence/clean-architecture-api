import { LoadSurveyById } from '@/domain/usecases'
import { LoadSurveyByIdRepository } from '../protocols'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor(
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async loadById(id: string): LoadSurveyById.Result {
    await this.loadSurveyByIdRepository.loadById(id)
    return null
  }
}
