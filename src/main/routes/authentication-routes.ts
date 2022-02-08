import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLoginController } from '../factories/controllers/login'
import { makeSignUpController } from '../factories/controllers/signup'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
