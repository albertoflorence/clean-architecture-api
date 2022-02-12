import { LoadSurveysController } from '@/presentation/controllers'
import { noContent, ok, serverError } from '@/presentation/helpers'
import { LoadSurveysStub } from '@/tests/presentation/mocks'
import { throwError } from '@/tests/domain/mocks'

interface SutTypes {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveysStub
}

const makeSut = (): SutTypes => {
  const loadSurveysStub = new LoadSurveysStub()
  const sut = new LoadSurveysController(loadSurveysStub)

  return { sut, loadSurveysStub }
}

describe('Load Survey Controller', () => {
  it('Should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const spyLoad = jest.spyOn(loadSurveysStub, 'load')
    await sut.handler({})
    expect(spyLoad).toHaveBeenCalled()
  })

  it('Should return 200 on success', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const httpResponse = await sut.handler({})
    expect(httpResponse).toEqual(ok(loadSurveysStub.result))
  })

  it('Should return 500 if LordSurveys throws ', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handler({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysStub } = makeSut()
    loadSurveysStub.result = []
    const httpResponse = await sut.handler({})
    expect(httpResponse).toEqual(noContent())
  })
})
