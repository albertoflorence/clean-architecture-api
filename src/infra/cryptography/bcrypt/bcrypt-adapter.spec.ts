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
  hash: async () => 'hashed_any_value',
  compare: async () => true
}))

describe('BcryptAdapter Adapter', () => {
  it('Should call bcrypt hash with correct values', async () => {
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

  it('Should call bcrypt compare with correct values', async () => {
    const { sut } = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('plaintext', 'hashed_any_value')
    expect(compareSpy).toHaveBeenCalledWith('plaintext', 'hashed_any_value')
  })
})
