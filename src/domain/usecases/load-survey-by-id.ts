import { SurveyModel } from '@/domain/models'

export interface LoadSurveyById {
  loadById: (id: string) => LoadSurveyById.Result
}

export namespace LoadSurveyById {
  export type Result = Promise<SurveyModel | null>
}
