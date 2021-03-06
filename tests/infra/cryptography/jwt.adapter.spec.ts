import { JwtAdapter } from '@/infra/cryptography'
import jwt from 'jsonwebtoken'

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

const token = 'any_token'
const anyValue = 'any_value'

jest.mock('jsonwebtoken', () => ({
  sign: (): string => 'any_token',
  verify: (): string => 'any_value'
}))

describe('Jwt Adapter', () => {
  describe('encrypter', () => {
    it('Should call jwt sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt(anyValue)
      expect(signSpy).toHaveBeenCalledWith(anyValue, 'secret')
    })

    it('Should return a token on success', async () => {
      const sut = makeSut()
      const accessToken = await sut.encrypt('any_id')
      expect(accessToken).toBe(token)
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

  describe('verify', () => {
    it('Should call verify with correct token', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt(token)
      expect(verifySpy).toHaveBeenCalledWith(token, 'secret')
    })

    it('Should return a value on verify success', async () => {
      const sut = makeSut()
      const value = await sut.decrypt(token)
      expect(value).toBe(anyValue)
    })

    it('Should return null on verify fail', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })
      const value = await sut.decrypt(token)
      expect(value).toBe(null)
    })
  })
})
