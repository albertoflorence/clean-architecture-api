import { Router, RequestHandler } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/add-survey.ts'
import { makeLoadSurveysController } from '../factories/controllers/load-surveys.ts'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export default (router: Router): void => {
  router.post(
    '/surveys',
    makeAuth('admin'),
    adaptRoute(makeAddSurveyController())
  )

  router.get('/surveys', makeAuth(), adaptRoute(makeLoadSurveysController()))
}

const makeAuth = (role?: string): RequestHandler =>
  adaptMiddleware(makeAuthMiddleware(role))
