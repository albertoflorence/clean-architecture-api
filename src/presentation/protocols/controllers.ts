import { HttpRequest, HttpResponse } from '@/presentation/protocols'

export interface Controller {
  handler: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
