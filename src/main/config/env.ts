import devEnv from './dev-env'

export default {
  mongoUrl: process.env.MONGO_URL ?? devEnv.mongoUrl,
  port: process.env.port ?? devEnv.port,
  jwtSecret: process.env.JWT_SECRET ?? devEnv.jwtSecret,
  bcryptSalt: 12
}
