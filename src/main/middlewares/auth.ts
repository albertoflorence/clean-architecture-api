import { RequestHandler } from 'express'
import { adaptMiddleware } from '@/main/adapters'
import { makeAuthMiddleware } from '@/main/factories'

const makeAuth = (role?: string): RequestHandler =>
  adaptMiddleware(makeAuthMiddleware(role))

export const adminAuth = (): RequestHandler => makeAuth('admin')
export const auth = (): RequestHandler => makeAuth()
