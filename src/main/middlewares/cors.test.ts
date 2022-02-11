import request from 'supertest'
import { app } from '@/main/config'

describe('Cors Middleware', () => {
  app.get('/test_cors', (req, res) => {
    res.send('')
  })
  it('', async () => {
    await request(app)
      .get('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
