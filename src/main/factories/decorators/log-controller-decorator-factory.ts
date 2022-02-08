import { LogErrorMongoRepository } from '../../../infra/db/mongodb/log'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'

export const makeLogControllerDecorator = (
  controller: Controller
): Controller =>
  new LogControllerDecorator(controller, new LogErrorMongoRepository())
