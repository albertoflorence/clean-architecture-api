import { Response, Request } from 'express'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export const adaptRoute =
  (controller: Controller) => (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    void controller
      .handler(httpRequest)
      .then(({ statusCode, body, redirect }: HttpResponse) => {
        if (redirect) {
          return res.redirect(statusCode || 302, redirect)
        }

        if (statusCode > 199 && statusCode < 300) {
          return res.status(statusCode).json(body)
        }

        return res.status(statusCode).json({
          error: body.message
        })
      })
  }
