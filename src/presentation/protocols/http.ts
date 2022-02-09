export interface HttpResponse {
  statusCode: number
  body: any
  redirect?: string
}

export interface HttpRequest {
  body?: any
  headers?: any
}
