import 'module-alias/register'
import { MongoDbHelper } from '@/infra/db'
import { env } from '@/main/config'
void MongoDbHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).app
    app.listen(env.port, () => {
      console.log(`Server running at http://localhost:${env.port}`)
    })
  })
  .catch(console.error)
