import { Collection, MongoClient } from 'mongodb'

class MongodbHelper {
  static instance: MongoClient
  static connect = async (uri: string): Promise<MongoClient> => {
    MongodbHelper.instance = await MongoClient.connect(uri)
    return MongodbHelper.instance
  }

  connect = async (uri: string): Promise<MongoClient> => {
    return await MongodbHelper.connect(uri)
  }

  disconnect = async (): Promise<void> => {
    await MongodbHelper.instance.close()
  }

  getCollection = (name: string): Collection => {
    return MongodbHelper.instance.db().collection(name)
  }
}

const mongoDbHelper = new MongodbHelper()

export { mongoDbHelper }
