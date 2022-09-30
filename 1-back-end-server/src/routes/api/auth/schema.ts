import { FastifySchema } from 'fastify'
import { RES_ERROR_COMMON } from '../../../common/error/schema.js'
import { SchemaStruct } from '../../../common/config/fastify/types.js'

// { body, querystring, params, headers, response } 등
// HTTP 통신에 필요한 파라미터 설정

const REQ_BODY_USERINFO: SchemaStruct = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' },
  },
}

export const RES_200_TOKEN_N_USER: SchemaStruct = {
  type: 'object',
  properties: {
    token: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    },
    user: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        username: { type: 'string' },
      },
    },
  },
}

export const SCHEMA_REGISTER_POST: FastifySchema = {
  body: REQ_BODY_USERINFO,
  response: {
    201: RES_200_TOKEN_N_USER,
    409: {
      ...RES_ERROR_COMMON,
      example: {
        type: 'UserExistsError',
        statusCode: 409,
        message: 'User already exists',
      },
    },
  },
}

export const SCHEMA_LOGIN_POST: FastifySchema = {
  /* 주의!: get 방식은 body 가 포함될 경우, 애러발생 */
  body: REQ_BODY_USERINFO,
  response: {
    200: RES_200_TOKEN_N_USER,
    401: {
      ...RES_ERROR_COMMON,
      example: {
        type: 'AuthenticationError',
        statusCode: 401,
        message: 'Invalid username password',
      },
    },
  },
}
