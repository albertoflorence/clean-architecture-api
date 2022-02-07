export interface AddAccount {
  add: (account: AddAccountModel) => Promise<boolean>
}

export interface AddAccountModel {
  name: string
  email: string
  password: string
}
