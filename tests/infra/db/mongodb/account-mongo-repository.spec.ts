import { Collection } from 'mongodb'
import { AccountModel } from '@/domain/models'
import { AddAccount } from '@/domain/usecases'
import { AccountMongoRepository, MongoDbHelper } from '@/infra/db'

let accountCollection: Collection

const makeFakeAddAccount = (): AddAccount.Params => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

describe('Account MongoDb Repository', () => {
  beforeAll(async () => {
    await MongoDbHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoDbHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoDbHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }
  describe('add', () => {
    it('Should return true on success', async () => {
      const sut = makeSut()
      const account = await sut.add(makeFakeAddAccount())
      expect(account).toBe(true)
    })
  })

  describe('loadByEmail', () => {
    it('Should return an account on success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(makeFakeAddAccount())

      const account = (await sut.loadByEmail(
        'any_email@mail.com'
      )) as AccountModel

      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@mail.com')
      expect(account.password).toBe('any_password')
    })

    it('Should return null if no account is found', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('any_mail@mail.com')
      expect(account).toBe(null)
    })
  })

  describe('updateAccessToken', () => {
    it('Should update the account accessToken', async () => {
      const sut = makeSut()
      const { insertedId } = await accountCollection.insertOne(
        makeFakeAddAccount()
      )
      await sut.updateAccessToken(insertedId.toHexString(), 'any_token')
      const account = await accountCollection.findOne({ _id: insertedId })

      expect(account?.accessToken).toBe('any_token')
    })
  })

  describe('loadByToken', () => {
    it('Should return an account on success', async () => {
      const sut = makeSut()
      const data = { accessToken: 'any_token', ...makeFakeAddAccount() }
      await accountCollection.insertOne({ ...data })

      const { id, ...account } = (await sut.loadByToken(
        'any_token'
      )) as AccountModel

      expect(id).toBeTruthy()
      expect(account).toEqual(data)
    })

    it('Should return null if loadByToken fails', async () => {
      const sut = makeSut()
      const data = {
        accessToken: 'any_token',
        ...makeFakeAddAccount()
      }
      await accountCollection.insertOne({ ...data })
      const account = await sut.loadByToken('wrong_token')
      expect(account).toBe(null)
    })
  })
})
