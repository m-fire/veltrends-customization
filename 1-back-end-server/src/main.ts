import fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'

const server: FastifyInstance = fastify({})

server.get('/ping', async () => {
  console.log(`uri visited: /ping`)
  return 'pong!'
})

server.listen({ port: 4000 })
