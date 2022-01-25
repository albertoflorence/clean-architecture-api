import { Collection, MongoClient } from 'mongodb'

export class MongoDbHelper {
  private static instance: MongoDbHelper

  static connect = async (uri: string): Promise<MongoDbHelper> => {
    MongoDbHelper.instance = new MongoDbHelper(await MongoClient.connect(uri))
    return MongoDbHelper.instance
  }

  constructor(private readonly client: MongoClient) {}

  static disconnect = async (): Promise<void> => {
    await this.instance.client.close()
  }

  static getCollection = (name: string): Collection => {
    return this.instance.client.db().collection(name)
  }
}
