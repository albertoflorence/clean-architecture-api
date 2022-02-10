import { RequestHandler } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

const makeAuth = (role?: string): RequestHandler =>
  adaptMiddleware(makeAuthMiddleware(role))

export const adminAuth = (): RequestHandler => makeAuth('admin')
export const auth = (): RequestHandler => makeAuth()
