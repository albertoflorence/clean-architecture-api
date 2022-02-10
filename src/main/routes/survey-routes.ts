import { Router } from 'express'

import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/add-survey.ts'
import { makeLoadSurveysController } from '../factories/controllers/load-surveys.ts'
import { adminAuth, auth } from '../middlewares/auth'

export default (router: Router): void => {
  router.post('/surveys', adminAuth(), adaptRoute(makeAddSurveyController()))

  router.get('/surveys', auth(), adaptRoute(makeLoadSurveysController()))
}
