import { SurveyModel } from '@/domain/models'

export interface LoadSurveys {
  load: () => LoadSurveys.Result
}

export namespace LoadSurveys {
  export type Result = Promise<SurveyModel[]>
}
