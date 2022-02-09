import jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/cryptography/decrypter'
import { Encrypter } from '../../../data/protocols/cryptography/encrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    return jwt.sign(value, this.secret)
  }

  async decrypt(token: string): Promise<string | null> {
    try {
      return jwt.verify(token, this.secret) as string
    } catch {
      return null
    }
  }
}
