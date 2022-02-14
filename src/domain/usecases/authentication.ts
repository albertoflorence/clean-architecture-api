export interface Authentication {
  auth: (credentials: Authentication.Params) => Authentication.Result
}

export namespace Authentication {
  export interface Params {
    email: string
    password: string
  }
  export type Result = Promise<string | null>
}
