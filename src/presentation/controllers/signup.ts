import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missingParamError'
import { badRequest } from '../helpers/httpHelpper'

export class SignUpController {
  handler = (httpRequest: HttpRequest): HttpResponse => {
    const missingParam = ['name', 'email'].find(
      param => !httpRequest.body[param]
    )
    if (missingParam) {
      return badRequest(new MissingParamError(missingParam))
    }
    return {
      statusCode: 200,
      body: {}
    }
  }
}
