import { FastifySchema } from 'fastify'

// { body, querystring, params, headers, response } 등
// HTTP 통신에 필요한 파라미터 설정

const REQ_BODY_LOGIN_USERINFO = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' },
  },
}

export const SCHEMA_POST_LOGIN: FastifySchema = {
  /* 주의!: get 방식은 body 가 포함될 경우, 애러발생 */
  body: REQ_BODY_LOGIN_USERINFO,
  response: {
    200: {
      type: 'object',
      properties: {
        token: { type: 'string' },
      },
      example: {
        token: '200 OK!',
      },
    },
  },
}

export const SCHEMA_POST_REGISTER: FastifySchema = {
  body: REQ_BODY_LOGIN_USERINFO,
}
