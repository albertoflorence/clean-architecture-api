import { HttpRequest, HttpResponse } from './http'

export interface Controller {
  handler: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
