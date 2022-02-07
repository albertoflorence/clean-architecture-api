export class UniqueParamError extends Error {
  constructor(paramName: string) {
    super(`Already in use: ${paramName}`)
    this.name = 'UniqueParamError'
  }
}
