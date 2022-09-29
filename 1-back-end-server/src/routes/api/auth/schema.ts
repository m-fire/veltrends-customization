import { FastifySchema } from 'fastify'

// { body, querystring, params, headers, response } 등
// HTTP 통신에 필요한 파라미터 설정

export const loginPostSchema: FastifySchema = {
  /* 주의!: get 방식은 body 가 포함될 경우, 애러발생 */
  body: {
    type: 'object',
    properties: {
      username: { type: 'string' },
      password: { type: 'string' },
    },
  },
}

export const registerPostSchema: FastifySchema = {
  body: {
    type: 'object',
    properties: {
      username: { type: 'string' },
      password: { type: 'string' },
    },
  },
}
