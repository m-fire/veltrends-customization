import { FastifySchema } from 'fastify'
import {
  APP_ERROR,
  composeExample,
  errorExample,
  REQUEST_LOGIN_USERINFO,
  REQUEST_REFRESH_POST,
  RESPONSE_AUTH_RESULT,
  RESPONSE_REFRESH_POST,
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

export const AUTH_REFRESH_POST: FastifySchema = {
  /* 주의!: get 방식은 body 가 포함될 경우, 애러발생 */
  body: REQUEST_REFRESH_POST,
  response: {
    200: RESPONSE_REFRESH_POST,
    400: composeExample(APP_ERROR, errorExample('BadReqeustError')),
    401: composeExample(APP_ERROR, errorExample('RefreshTokenError')),
  },
}
