export interface UpdateAccessTokenRepository {
  updateAccessToken: (
    id: string,
    token: string
  ) => UpdateAccessTokenRepository.Result
}

export namespace UpdateAccessTokenRepository {
  export type Result = Promise<void>
}
