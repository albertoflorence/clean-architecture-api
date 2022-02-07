import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import path from 'path'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)

  readdirSync(path.join(__dirname, '..', 'routes')).forEach(file => {
    if (/\w*-routes.(ts|js)$/.test(file)) {
      void import('../routes/' + file).then(route => route.default(router))
    }
  })
}
