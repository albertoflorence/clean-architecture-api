export const throwError = (): never => {
  throw new Error()
}

export const defaultValues = (value: any): any => {
  const obj: any = {}
  if (typeof value === 'string') return ''
  if (typeof value === 'number') return -Infinity
  if (typeof value === 'boolean') return true
  if (value instanceof Date) return new Date('1970-01-01T00:00:00.001Z')
  if (value instanceof Object) {
    Object.keys(value).forEach(key => {
      obj[key] = defaultValues(value[key])
    })
  }
  return obj
}
