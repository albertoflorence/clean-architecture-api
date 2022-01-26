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
        res.status(statusCode).json(body)
      })
  }
