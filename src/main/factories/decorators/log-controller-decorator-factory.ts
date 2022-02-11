import { LogErrorMongoRepository } from '@/infra/db'
import { LogControllerDecorator } from '@/main/decorators'
import { Controller } from '@/presentation/protocols'

export const makeLogControllerDecorator = (
  controller: Controller
): Controller =>
  new LogControllerDecorator(controller, new LogErrorMongoRepository())
