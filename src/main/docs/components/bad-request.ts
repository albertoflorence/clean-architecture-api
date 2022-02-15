export const badRequest = {
  description: 'Requisição inválida',
  concent: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
