import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/add-survey.ts'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export default (router: Router): void => {
  router.post(
    '/surveys',
    adaptMiddleware(makeAuthMiddleware('admin')),
    adaptRoute(makeAddSurveyController())
  )
}
