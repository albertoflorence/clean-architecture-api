import { HttpRequest, HttpResponse } from './http'

export interface Middleware {
  handler: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
