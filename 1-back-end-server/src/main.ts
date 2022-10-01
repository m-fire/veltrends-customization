import fastify, { FastifyInstance } from 'fastify'
import fastifySwagger from '@fastify/swagger'
import routes from './routes/index.js'
import { swaggerOptions } from './common/config/fastify/swagger.js'
import AppError from './common/error/AppError.js'
import authPlugin from './common/config/fastify/plugin/auth-plugin.js'

const server: FastifyInstance = fastify({
  logger: true,
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

// Todo: fastify 4.? 하위버전에서는 routes 전에 등록해야 플러그인 로직이 정상동작!
server.register(authPlugin) // 전역에서 인증사용자 인증처리 플러그인
server.register(routes)

server.listen({ port: 4000 })
