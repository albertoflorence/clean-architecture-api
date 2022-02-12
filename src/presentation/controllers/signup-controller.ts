import { AddAccount } from '@/domain/usecases'
import { badRequest, redirect, serverError } from '@/presentation/helpers'
import {
  Controller,
  ValidationAsync,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols'

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: ValidationAsync
  ) {}

  public handler = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    try {
      const { body } = httpRequest
      const { name, email, password } = body

      const error = await this.validation.validate(body)
      if (error) return badRequest(error)

      await this.addAccount.add({ name, email, password })

      return redirect('login', 307)
    } catch (error) {
      return serverError(error)
    }
  }
}
