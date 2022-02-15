import express from 'express'
import setupMiddlewares from './middlewares'
import setupRoutes from './routes'
import swaggerSetup from './swagger'

const app = express()
swaggerSetup(app)
setupMiddlewares(app)
setupRoutes(app)

export { app }
