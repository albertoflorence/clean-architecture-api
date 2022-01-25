import request from 'supertest'
import app from '../config/app'

describe('BodyParser Middlware', () => {
  it('Should parse body as json', async () => {
    app.post('/test_urlencoded', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test_urlencoded')
      .send({ name: 'valid_name' })
      .expect({ name: 'valid_name' })
  })
})
