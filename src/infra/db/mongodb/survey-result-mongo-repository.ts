import { AddSurveyResultRepository } from '@/data/protocols'
import { Collection, ObjectId } from 'mongodb'
import { MongoDbHelper, QueryBuilder } from '@/infra/db'
import { SurveyResultModel } from '@/domain/models'

export class SurveyResultMongoRepository implements AddSurveyResultRepository {
  async add(
    data: AddSurveyResultRepository.Params
  ): AddSurveyResultRepository.Result {
    const { surveyId, accountId, answer, date } = data
    await this.collection.findOneAndUpdate(
      { surveyId: new ObjectId(surveyId), accountId: new ObjectId(accountId) },
      { $set: { answer, date } },
      { upsert: true, returnDocument: 'after' }
    )
    return (await this.loadBySurveyId(surveyId, accountId)) as any
  }

  async loadBySurveyId(
    surveyId: string,
    accountId: string
  ): Promise<SurveyResultModel | null> {
    const query = new QueryBuilder()
      .match({
        surveyId: new ObjectId(surveyId)
      })
      .group({
        _id: 0,
        data: {
          $push: '$$ROOT'
        },
        total: {
          $sum: 1
        }
      })
      .unwind({
        path: '$data'
      })
      .lookup({
        from: 'surveys',
        foreignField: '_id',
        localField: 'data.surveyId',
        as: 'survey'
      })
      .unwind({
        path: '$survey'
      })
      .group({
        _id: {
          surveyId: '$survey._id',
          question: '$survey.question',
          date: '$survey.date',
          total: '$total',
          answer: '$data.answer',
          answers: '$survey.answers'
        },
        count: {
          $sum: 1
        },
        currentAccountAnswer: {
          $push: {
            $cond: [
              { $eq: ['$data.accountId', new ObjectId(accountId)] },
              '$data.answer',
              '$invalid'
            ]
          }
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $map: {
            input: '$_id.answers',
            as: 'item',
            in: {
              $mergeObjects: [
                '$$item',
                {
                  count: {
                    $cond: {
                      if: {
                        $eq: ['$$item.answer', '$_id.answer']
                      },
                      then: '$count',
                      else: 0
                    }
                  },
                  percent: {
                    $cond: {
                      if: {
                        $eq: ['$$item.answer', '$_id.answer']
                      },
                      then: {
                        $multiply: [
                          {
                            $divide: ['$count', '$_id.total']
                          },
                          100
                        ]
                      },
                      else: 0
                    }
                  },
                  isCurrentAccountAnswerCount: {
                    $cond: [
                      {
                        $eq: [
                          '$$item.answer',
                          {
                            $arrayElemAt: ['$currentAccountAnswer', 0]
                          }
                        ]
                      },
                      1,
                      0
                    ]
                  }
                }
              ]
            }
          }
        }
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date'
        },
        answers: {
          $push: '$answers'
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: {
          $reduce: {
            input: '$answers',
            initialValue: [],
            in: {
              $concatArrays: ['$$value', '$$this']
            }
          }
        }
      })
      .unwind({
        path: '$answers'
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date',
          answer: '$answers.answer',
          image: '$answers.image'
        },
        count: {
          $sum: '$answers.count'
        },
        percent: {
          $sum: '$answers.percent'
        },
        isCurrentAccountAnswerCount: {
          $sum: '$answers.isCurrentAccountAnswerCount'
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answer: {
          answer: '$_id.answer',
          image: '$_id.image',
          count: '$count',
          percent: '$percent',
          isCurrentAccountAnswer: {
            $eq: ['$isCurrentAccountAnswerCount', 1]
          }
        }
      })
      .sort({
        'answer.count': -1
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date'
        },
        answers: {
          $push: '$answer'
        }
      })
      .project({
        _id: 0,
        surveyId: {
          $toString: '$_id.surveyId'
        },
        question: '$_id.question',
        date: '$_id.date',
        answers: '$answers'
      })
      .build()
    const surveyResult = await this.collection
      .aggregate<SurveyResultModel>(query)
      .toArray()
    return surveyResult.length ? surveyResult[0] : null
  }

  private get collection(): Collection {
    return MongoDbHelper.getCollection('surveyResults')
  }
}
