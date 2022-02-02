import { Response, Request } from 'express'
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols'

export const adaptRoute =
  (controller: Controller) => (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    void controller
      .handler(httpRequest)
      .then(({ statusCode, body }: HttpResponse) => {
        if (statusCode === 200) {
          res.status(statusCode).json(body)
        } else {
          res.status(statusCode).json({
            error: body.message
          })
        }
      })
  }
