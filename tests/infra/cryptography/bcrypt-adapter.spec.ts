import { BcryptAdapter } from '@/infra/cryptography'
import bcrypt from 'bcrypt'

interface SutTypes {
  sut: BcryptAdapter
}

const makeSut = (): SutTypes => {
  const sut = new BcryptAdapter(12)
  return { sut }
}

const hashValue = 'hash_value'
const plaintext = 'plaintext'

jest.mock('bcrypt', () => ({
  hash: async (): Promise<string> => hashValue,
  compare: async (): Promise<boolean> => true
}))

describe('Bcrypt Adapter', () => {
  describe('hash', () => {
    it('Should call hash with correct values', async () => {
      const { sut } = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_value')
      expect(hashSpy).toHaveBeenCalledWith('any_value', 12)
    })

    it('Should return a hashed value on hash success', async () => {
      const { sut } = makeSut()
      const hashedValue = await sut.hash('any_value')
      expect(hashedValue).toBe(hashValue)
    })
  })

  describe('compare', () => {
    it('Should call compare with correct values', async () => {
      const { sut } = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare(plaintext, hashValue)
      expect(compareSpy).toHaveBeenCalledWith(plaintext, hashValue)
    })

    it('Should return false if compare returns false', async () => {
      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false)

      const isValid = await sut.compare(plaintext, hashValue)
      expect(isValid).toBe(false)
    })

    it('Should return true if compare returns true', async () => {
      const { sut } = makeSut()

      const isValid = await sut.compare(plaintext, hashValue)
      expect(isValid).toBe(true)
    })
  })
})
