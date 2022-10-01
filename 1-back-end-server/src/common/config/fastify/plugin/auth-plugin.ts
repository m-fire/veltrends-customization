import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

const authPluginAsync: FastifyPluginAsync = async (fastify, options) => {
  fastify.addHook('preHandler', async (request) => {
    console.log(`AuthPlugin authPluginAsync()=>preHandler() logged`)
  })
}

const authPlugin = fp(authPluginAsync, {
  name: 'authPlugin',
})

export default authPlugin
