import { Response, Request, NextFunction } from 'express'
import {
  HttpRequest,
  HttpResponse,
  Middleware
} from '../../presentation/protocols'

export const adaptMiddleware =
  (middleware: Middleware) =>
  (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      headers: req.headers
    }

    void middleware
      .handler(httpRequest)
      .then(({ statusCode, body }: HttpResponse) => {
        if (statusCode === 200) {
          Object.assign(req, body)
          next()
        } else {
          res.status(statusCode).json({
            error: body.error
          })
        }
      })
  }
