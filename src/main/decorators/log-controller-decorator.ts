import { LogErrorRepository } from '../../data/protocols/db/log/log-error-repository'
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols'

export class LogControllerDecorator implements Controller {
  constructor(
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository
  ) {}

  handler = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    const httpResponse = await this.controller.handler(httpRequest)
    if (httpResponse.statusCode === 500) {
      void this.logErrorRepository.saveLog(httpResponse.body.stack)
    }
    return httpResponse
  }
}
