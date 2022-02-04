import { Encrypter } from '../../../data/protocols/cryptography/encrypter'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Encrypter {
  constructor(private readonly salt: number) {}
  encrypt = async (string: string): Promise<string> => {
    return await bcrypt.hash(string, this.salt)
  }
}
