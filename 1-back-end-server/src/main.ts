import fastify, { FastifyInstance } from 'fastify'
import fastifySwagger from '@fastify/swagger'
import routes from './routes/index.js'
import { swaggerOptions } from './common/config/fastify/swagger.js'

const server: FastifyInstance = fastify({
  logger: true,
})

server.get('/ping', async () => {
  return 'pong!'
})

// js 파일 root 에 `await`사용은 Node16 부터 지원.
// 즉, tsconfig 의 모듈버전을 ES2022로 맞출 시 애러없이 실행가능.
await server.register(fastifySwagger, swaggerOptions)
server.register(routes)

server.listen({ port: 4000 })
