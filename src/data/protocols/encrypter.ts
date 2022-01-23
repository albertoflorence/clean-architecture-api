export interface Encrypter {
  encrypt: (string: string) => Promise<string>
}
