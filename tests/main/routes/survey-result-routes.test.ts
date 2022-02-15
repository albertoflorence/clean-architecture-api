import { app } from '@/main/config'
import request from 'supertest'

describe('Survey Result Routes', () => {
  describe('PUT /surveys/:surveyId/results', () => {
    it('Should return 403 on add survey result without accessToken', async () => {
      await request(app).put('/api/surveys/any_id/results').send().expect(403)
    })
  })
})
