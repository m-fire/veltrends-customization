import { SwaggerOptions } from '@fastify/swagger'

/**
 * fastify/swagger documentation default configure
 * ref: https://github.com/fastify/fastify-swagger#usage
 */
export const swaggerOptions: SwaggerOptions = {
  /* documentation  */
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'Test swagger',
      description: 'Fastify swagger API 테스트',
      version: '0.1.0',
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: '여기에서 더 많은 정보를 찾아보세요',
    },
    host: 'localhost',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'user', description: '사용자 관련 엔드포인트' },
      { name: 'code', description: '코드 관련 엔드포인트' },
    ],
    // definitions: {
    //   User: {
    //     type: 'object',
    //     required: ['id', 'email'],
    //     properties: {
    //       id: { type: 'string', format: 'uuid' },
    //       firstName: { type: 'string' },
    //       lastName: { type: 'string' },
    //       email: { type: 'string', format: 'email' },
    //     },
    //   },
    // },
    // securityDefinitions: {
    //   apiKey: {
    //     type: 'apiKey',
    //     name: 'apiKey',
    //     in: 'header',
    //   },
    // },
  },
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next()
    },
    preHandler: function (request, reply, next) {
      next()
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  exposeRoute: true,
}
