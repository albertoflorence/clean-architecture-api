import { MongoDbHelper } from '../infra/criptography/db/mongodb/helpers/mongo-helper'

import env from './config/env'

void MongoDbHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(env.port, () =>
      console.log(`Server running at http://localhost:${env.port}`)
    )
  })
  .catch(console.error)
