import fastify, { FastifyInstance } from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifyCookie from '@fastify/cookie'
import routes from './routes/index.js'
import { swaggerOptions } from './common/config/fastify/swagger.js'
import AppError from './common/error/AppError.js'
import {
  endpointAuthPlugin,
  globalAuthPlugin,
} from './common/config/fastify/plugin/auth-plugins.js'
import { PING_GET_SCHEMA, PING_POST_SCHEMA } from './schema.js'
import { fastifyCors } from '@fastify/cors'

const server: FastifyInstance = fastify({
  logger: true,
})

console.log(`Veltrend BE Server - main.ts NODE_ENV:`, process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
  server.register(fastifyCors, {
    origin: /localhost/,
    allowedHeaders: ['Cookie', 'Content-Type'],
    credentials: true,
  })
}

/* register server plugins */
{
  // js 파일 root 에 `await`사용은 Node16 부터 지원.
  // 즉, tsconfig 의 모듈버전을 ES2022로 맞출 시 애러없이 실행가능.
  await server.register(fastifySwagger, swaggerOptions)
  server.register(fastifyCookie)
  // Todo: fastify 4.? 하위버전에서는 routes 전에 등록해야 플러그인 로직이 정상동작!
  server.register(globalAuthPlugin) // 전역에서 인증사용자 인증처리 플러그인
  server.register(routes)
}

/* URI tests */
{
  // Public URI
  server.get(
    '/ping',
    { schema: PING_GET_SCHEMA },
    async () => '`pong` from GET',
  )
  /* Secure URI특정 URI(/ping:post) 에 보안검사 플러긴을 적용한 예: */
  server.register(async (fi) => {
    fi.register(endpointAuthPlugin) //
    fi.post('/ping', { schema: PING_POST_SCHEMA }, async (reqest, reply) => {
      return '`pong✅` from POST'
    })
  })
}

server.setErrorHandler(async (error, request, reply) => {
  reply.statusCode = error.statusCode || 500
  return {
    ...(error instanceof AppError && error),
    name: error.name,
    message: error.message,
    statusCode: error.statusCode,
  }
})

server.listen({ port: 4000 })
