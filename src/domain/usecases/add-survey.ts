export interface AddSurvey {
  add: (data: AddSurvey.Params) => AddSurvey.Result
}

export namespace AddSurvey {
  export interface Params {
    question: string
    answers: SurveyAnswer[]
    date: Date
  }
  interface SurveyAnswer {
    image?: string
    answer: string
  }
  export type Result = Promise<void>
}
