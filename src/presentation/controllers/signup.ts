export class SignUpController {
  handler = (httpRequest: any): any => {
    return {
      statusCode: 400,
      body: new Error('Missing param: name')
    }
  }
}
