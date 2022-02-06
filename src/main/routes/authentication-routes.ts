import { Router } from 'express'
import { routeLoginController } from '../factories/login'
import { routeSignUpController } from '../factories/signup'

export default (router: Router): void => {
  router.post('/signup', routeSignUpController)
  router.post('/login', routeLoginController)
}
