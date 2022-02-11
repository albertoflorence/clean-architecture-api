import 'dotenv/config'

export const env = {
  mongoUrl: process.env.MONGO_URL as string,
  port: process.env.PORT as string,
  jwtSecret: process.env.JWT_SECRET as string,
  bcryptSalt: parseInt(process.env.BCRYPT_SALT as string)
}
