import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missingParamError'
import { badRequest } from '../helpers/httpHelpper'
import { Controller } from '../protocols/controllers'

export class SignUpController implements Controller {
  handler = (httpRequest: HttpRequest): HttpResponse => {
    const missingParam = ['name', 'email', 'password', 'passwordConfirm'].find(
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
