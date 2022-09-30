import fastify, { FastifyInstance } from 'fastify'
import fastifySwagger from '@fastify/swagger'
import routes from './routes/index.js'
import { swaggerOptions } from './common/config/fastify/swagger.js'
import db from './common/config/prisma/db-client.js'
import AppError from './common/error/AppError.js'

const server: FastifyInstance = fastify({
  logger: true,
})

// db.user
//   .create({
//     data: {
//       username: `member-${randomUUID().substring(0, 2)}`,
//       passwordHash: 'e8d95f34-2e83-4916-9189-07c75796afb8',
//     },
//   })
//   .then(console.log)

server.get('/ping', async () => {
  return 'pong!'
})

// js 파일 root 에 `await`사용은 Node16 부터 지원.
// 즉, tsconfig 의 모듈버전을 ES2022로 맞출 시 애러없이 실행가능.
await server.register(fastifySwagger, swaggerOptions)

server.setErrorHandler(async (error, request, reply) => {
  reply.statusCode = error.statusCode || 500
  return error instanceof AppError
    ? {
        ...error, // type, statusCode, etc..
        message: error.message,
      }
    : error // FastifyError
})

server.register(routes)

server.listen({ port: 4000 })
