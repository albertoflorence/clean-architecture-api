import { Hasher } from '../../../data/protocols/cryptography/hasher'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher {
  constructor(private readonly salt: number) {}
  hash = async (plaintext: string): Promise<string> => {
    return await bcrypt.hash(plaintext, this.salt)
  }
}
