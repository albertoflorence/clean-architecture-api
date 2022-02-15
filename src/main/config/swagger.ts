import swaggerConfig from '@/main/docs'

import { serve, setup } from 'swagger-ui-express'
import { Express } from 'express'
import { noCache } from '../middlewares/noCache'

export default (app: Express): void => {
  app.use('/api-docs', noCache, serve, setup(swaggerConfig))
}
