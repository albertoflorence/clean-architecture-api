import {
  accountSchema,
  loginParamsSchema,
  errorSchema,
  surveysSchema,
  surveySchema,
  surveyAnswerSchema,
  signUpParamsSchema,
  surveyResultParamsSchema,
  surveyResultSchema
} from './schemas/'

export default {
  account: accountSchema,
  loginParams: loginParamsSchema,
  error: errorSchema,
  surveys: surveysSchema,
  survey: surveySchema,
  surveyAnswer: surveyAnswerSchema,
  signUpParams: signUpParamsSchema,
  surveyResultParams: surveyResultParamsSchema,
  surveyResult: surveyResultSchema
}
