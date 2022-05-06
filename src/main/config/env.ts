import 'dotenv/config'

export const env = {
  mongoUrl: process.env.MONGO_URL as string,
  port: process.env.PORT ?? 8080,
  jwtSecret: process.env.JWT_SECRET ?? 'SECRET123',
  bcryptSalt: parseInt(process.env.BCRYPT_SALT ?? '12')
}
