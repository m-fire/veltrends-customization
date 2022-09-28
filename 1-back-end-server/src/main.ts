import fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import routes from './routes/index.js'

const server: FastifyInstance = fastify({
  logger: true,
})

server.get('/ping', async () => {
  return 'pong!'
})

server.register(routes)

server.listen({ port: 4000 })
