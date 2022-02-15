import { AddSurveyResult, LoadSurveyById } from '@/domain/usecases'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class AddSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly addSurveyResult: AddSurveyResult
  ) {}

  async handler(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))

      const { answer } = httpRequest.body
      const isValid = survey.answers.some(item => answer === item.answer)
      if (!isValid) return forbidden(new InvalidParamError('answer'))

      const accountId = httpRequest.accountId as string
      await this.addSurveyResult.add({
        surveyId,
        accountId,
        answer,
        question: survey.question,
        date: new Date()
      })

      return ok({})
    } catch (error) {
      return serverError(error)
    }
  }
}
