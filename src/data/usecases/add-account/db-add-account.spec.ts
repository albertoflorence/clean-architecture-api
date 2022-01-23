import { DbAddAccount } from './db-add-account'
import { Encrypter } from '../../protocols/encrypter'

interface SutTypes {
  stu: DbAddAccount
  encrypterStub: Encrypter
  // dbAccountRepository: Db
}

class EncrypterStub implements Encrypter {
  encrypt = async (string: string): Promise<string> =>
    await Promise.resolve('encrypted_valid_password')
}

const makeSut = (): SutTypes => {
  const encrypterStub = new EncrypterStub()
  const stu = new DbAddAccount(encrypterStub)
  return { stu, encrypterStub }
}

describe('DB addAccount', () => {
  it('Should call Encrypt with correct password', async () => {
    const { stu, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const account = {
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password'
    }
    await stu.add(account)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  it('Should throw if Encrypter throws', async () => {
    const { stu, encrypterStub } = makeSut()
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockImplementationOnce(async () => await Promise.reject(new Error()))
    const account = {
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password'
    }
    const accountAdd = stu.add(account)
    await expect(accountAdd).rejects.toThrowError(new Error())
  })
})
