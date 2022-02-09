import jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/cryptography/decrypter'
import { Encrypter } from '../../../data/protocols/cryptography/encrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string) {}

  async encrypt(id: string): Promise<string> {
    return jwt.sign({ id }, this.secret)
  }

  async decrypt(token: string): Promise<string | null> {
    jwt.verify(token, this.secret)
    return null
  }
}
