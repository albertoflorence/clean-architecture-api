import { Collection, MongoClient } from 'mongodb'

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
let client = {} as MongoClient

export const MongoDbHelper = {
  async connect(uri: string): Promise<void> {
    client = await MongoClient.connect(uri)
  },

  async disconnect(): Promise<void> {
    await client.close()
  },

  getCollection(name: string): Collection {
    return client.db().collection(name)
  },

  map(data: any): any {
    const { _id, ...rest } = data
    return {
      id: _id.toHexString(),
      ...rest
    }
  }
}

export { Collection }
