import { Decrypter, Encrypter, HashComparer, Hasher } from '@/data/protocols'

export class HashComparerStub implements HashComparer {
  plaintext: string = ''
  digest: string = ''
  isValid = true
  compare = async (plaintext: string, digest: string): Promise<boolean> => {
    this.plaintext = plaintext
    this.digest = digest
    return this.isValid
  }
}

export class HasherStub implements Hasher {
  plaintext: string = ''
  digest = 'any_hash'
  hash = async (plaintext: string): Promise<string> => {
    this.plaintext = plaintext
    return this.digest
  }
}

export class EncrypterStub implements Encrypter {
  result = 'any_token'
  plaintext: string = ''
  encrypt = async (plaintext: string): Promise<string> => {
    this.plaintext = plaintext
    return this.result
  }
}

export class DecrypterStub implements Decrypter {
  result: string | null = 'any_text'
  cipherText: string | null = null
  decrypt = async (cipherText: string): Promise<string | null> => {
    this.cipherText = cipherText
    return this.result
  }
}
