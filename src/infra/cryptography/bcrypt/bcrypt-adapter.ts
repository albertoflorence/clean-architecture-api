import { Hasher } from '../../../data/protocols/cryptography/hasher'
import { HashComparer } from '../../../data/protocols/cryptography/hash-comparer'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number) {}

  hash = async (plaintext: string): Promise<string> => {
    return await bcrypt.hash(plaintext, this.salt)
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash)
  }
}
