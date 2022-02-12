import { DbAddAccount } from '@/data/usecases'
import { AddAccountRepositoryStub, HasherStub } from '@/tests/data/mocks'
import { mockAddAccountParams } from '@/tests/domain/mocks'
import { throwError } from '../../domain/mocks/test-helpers'

interface SutTypes {
  sut: DbAddAccount
  hasherStub: HasherStub
  addAccountRepositoryStub: AddAccountRepositoryStub
}

const makeSut = (): SutTypes => {
  const hasherStub = new HasherStub()
  const addAccountRepositoryStub = new AddAccountRepositoryStub()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)
  return { sut, hasherStub, addAccountRepositoryStub }
}

describe('DB addAccount', () => {
  it('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    await sut.add(mockAddAccountParams())
    expect(mockAddAccountParams().password).toBe(hasherStub.plaintext)
  })

  it('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(throwError)
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrowError(new Error())
  })

  it('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub, hasherStub } = makeSut()
    await sut.add(mockAddAccountParams())
    expect(addAccountRepositoryStub.account).toEqual({
      ...mockAddAccountParams(),
      password: hasherStub.digest
    })
  })

  it('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockImplementationOnce(throwError)
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  it('Should return true on success', async () => {
    const { sut } = makeSut()
    const isValid = await sut.add(mockAddAccountParams())
    expect(isValid).toEqual(true)
  })
})
