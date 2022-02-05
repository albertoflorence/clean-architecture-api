import jwt from 'jsonwebtoken'
import { Encrypter } from '../../../data/protocols/cryptography/encrypter'

export class JwtAdapter implements Encrypter {
  constructor(private readonly secret: string) {}

  async encrypt(id: string): Promise<string> {
    return jwt.sign({ id }, this.secret)
  }
}
