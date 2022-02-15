export const serverError = {
  description: 'Problema no servidor',
  concent: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
