import { FastifySchema } from 'fastify'
import { SwaggerSchema } from '../../../common/config/fastify/types.js'

// { body, querystring, params, headers, response } 등
// HTTP 통신에 필요한 파라미터 설정

const REQ_BODY_LOGIN_USERINFO: SwaggerSchema = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' },
  },
}

const RES_200_AUTH_COMMON: SwaggerSchema<SwaggerSchema> = {
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
        id: { type: 'string' },
        username: { type: 'string' },
      },
    },
  },
}

export const SCHEMA_LOGIN_POST: FastifySchema = {
  /* 주의!: get 방식은 body 가 포함될 경우, 애러발생 */
  body: REQ_BODY_LOGIN_USERINFO,
  response: {
    200: RES_200_AUTH_COMMON,
  },
}

export const SCHEMA_REGISTER_POST: FastifySchema = {
  body: REQ_BODY_LOGIN_USERINFO,
  response: {
    200: RES_200_AUTH_COMMON,
  },
}
