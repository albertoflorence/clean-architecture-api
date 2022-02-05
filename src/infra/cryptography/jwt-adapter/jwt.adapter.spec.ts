import { JwtAdapter } from './jwt.adapter'
import jwt from 'jsonwebtoken'
import { Encrypter } from '../../../data/protocols/cryptography/encrypter'

const makeSut = (): Encrypter => {
  return new JwtAdapter('secret')
}

jest.mock('jsonwebtoken', () => ({
  sign: (): string => 'any_token'
}))

describe('Jwt Adapter', () => {
  it('Should call jwt sign with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_value')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_value' }, 'secret')
  })

  it('Should return a token on success', async () => {
    const sut = makeSut()
    const accessToken = await sut.encrypt('any_id')
    expect(accessToken).toBe('any_token')
  })

  it('Should throw if sign throws', async () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementation(() => {
      throw new Error()
    })
    const promise = sut.encrypt('any_id')
    await expect(promise).rejects.toThrow()
  })
})
