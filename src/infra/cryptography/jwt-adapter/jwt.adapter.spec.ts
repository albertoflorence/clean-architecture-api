import { JwtAdapter } from './jwt.adapter'
import jsonwebtoken from 'jsonwebtoken'
import { Encrypter } from '../../../data/protocols/cryptography/encrypter'

const makeSut = (): Encrypter => {
  return new JwtAdapter('secret')
}

describe('Jwt Adapter', () => {
  it('Should call sign with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jsonwebtoken, 'sign')
    await sut.encrypt('any_value')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_value' }, 'secret')
  })
})
