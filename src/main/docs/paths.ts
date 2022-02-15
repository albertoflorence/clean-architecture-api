import { loginPath, surveyPath, signUpPath, surveyResultPath } from './paths/'

export default {
  '/login': loginPath,
  '/surveys': surveyPath,
  '/signUp': signUpPath,
  '/surveys/{surveyId}/results': surveyResultPath
}
