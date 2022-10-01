import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

// ref: https://www.fastifyio/docs/latest/Reference/TypeScript/#creating-a-typescript-fastify-plugin

const authPluginAsync: FastifyPluginAsync = async (fastify, options) => {
  fastify.decorateRequest('user', null)
  console.log(`AuthPlugin authPluginAsync()=>preHandler() `)
  fastify.addHook('preHandler', async (request) => {
    console.log(`AuthPlugin authPluginAsync()=>preHandler() logged`)
  })
}

const authPlugin = fp(authPluginAsync, {
  name: 'authPlugin',
})

export default authPlugin

// 선언 병합을 사용하여 적절한 fastify 인터페이스에 플러그인 소품 추가
// 여기에 prop 유형이 정의되어 있으면 장식{,Request,Reply}을 호출할 때 값이 유형 검사됩니다.
declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: number
      username: string
    } | null
  }
}
