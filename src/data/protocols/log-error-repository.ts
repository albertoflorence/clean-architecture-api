export interface LogErrorRepository {
  saveLog: (stack: string) => Promise<void>
}
