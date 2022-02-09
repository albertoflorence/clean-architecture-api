export interface Decrypter {
  decrypt: (string: string) => Promise<string>
}
