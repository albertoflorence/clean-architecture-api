import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter/jwt.adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogErrorMongoRepository } from '../../../infra/db/mongodb/log'
import {
  Controller,
  LoginController
} from '../../../presentation/controllers/login/login-controller-protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeLoginValidation } from './login-validation-factory'
import env from '../../config/env'
import { adaptRoute } from '../../adapters/express-route-adapter'

export const makeLoginController = (): Controller => {
  const authentication = new DbAuthentication(
    new AccountMongoRepository(),
    new BcryptAdapter(env.bcryptSalt),
    new JwtAdapter(env.jwtSecret),
    new AccountMongoRepository()
  )

  const loginController = new LoginController(
    makeLoginValidation(),
    authentication
  )

  return new LogControllerDecorator(
    loginController,
    new LogErrorMongoRepository()
  )
}

export const routeLoginController = adaptRoute(makeLoginController())
