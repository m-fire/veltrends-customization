import { FastifySchema } from 'fastify'
import AppError from '../../../common/error/AppError.js'
import {
  APP_ERROR,
  composeExample,
  errorExample,
  REQUEST_LOGIN_USERINFO,
  RESPONSE_AUTH_RESULT,
} from '../../../common/schema/common-schema.js'

// { body, querystring, params, headers, response } 등
// HTTP 통신에 필요한 파라미터 설정

export const AUTH_REGISTER_POST: FastifySchema = {
  body: REQUEST_LOGIN_USERINFO,
  response: {
    201: RESPONSE_AUTH_RESULT,
    409: composeExample(APP_ERROR, errorExample('UserExistsError')),
  },
}

export const AUTH_LOGIN_POST: FastifySchema = {
  /* 주의!: get 방식은 body 가 포함될 경우, 애러발생 */
  body: REQUEST_LOGIN_USERINFO,
  response: {
    200: RESPONSE_AUTH_RESULT,
    401: composeExample(APP_ERROR, errorExample('AuthenticationError')),
  },
}
