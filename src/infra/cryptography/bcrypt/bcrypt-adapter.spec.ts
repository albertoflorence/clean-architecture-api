import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

interface SutTypes {
  sut: BcryptAdapter
}

const makeSut = (): SutTypes => {
  const sut = new BcryptAdapter(12)
  return { sut }
}

jest.mock('bcrypt', () => ({
  hash: async (): Promise<string> => 'hashed_any_value',
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
      expect(hashedValue).toBe('hashed_any_value')
    })
  })

  describe('compare', () => {
    it('Should call compare with correct values', async () => {
      const { sut } = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.compare('plaintext', 'hashed_any_value')
      expect(compareSpy).toHaveBeenCalledWith('plaintext', 'hashed_any_value')
    })

    it('Should return false if compare returns false', async () => {
      const { sut } = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false)

      const isValid = await sut.compare('plaintext', 'hashed_any_value')
      expect(isValid).toBe(false)
    })

    it('Should return true if compare returns true', async () => {
      const { sut } = makeSut()

      const isValid = await sut.compare('plaintext', 'hashed_any_value')
      expect(isValid).toBe(true)
    })
  })
})
