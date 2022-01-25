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
  hash: async () => 'hashed_any_value'
}))

describe('BcryptAdapter Adapter', () => {
  it('Should call bcrypt with correct values', async () => {
    const { sut } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', 12)
  })

  it('Should return a hashed on success', async () => {
    const { sut } = makeSut()
    const hashedValue = await sut.encrypt('any_value')
    expect(hashedValue).toBe('hashed_any_value')
  })
})
