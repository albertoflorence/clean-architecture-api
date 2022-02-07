import { ServerError } from '../errors/serverError'
import { UnauthorizedError } from '../errors/unauthorized-error'
import { HttpResponse } from '../protocols/http'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error
})

export const serverError = (error?: unknown): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error instanceof Error ? error.stack : 'untraceable')
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const redirect = (
  url: string,
  statusCode: number = 302
): HttpResponse => ({
  statusCode,
  redirect: url,
  body: {}
})
