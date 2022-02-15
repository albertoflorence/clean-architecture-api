export const unauthorized = {
  description: 'Credenciais inválidas',
  concent: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
