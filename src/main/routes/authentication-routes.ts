import { Router } from 'express'
import { routeSignUpController } from '../factories/signup'

export default (router: Router): void => {
  router.post('/signup', routeSignUpController)
}
