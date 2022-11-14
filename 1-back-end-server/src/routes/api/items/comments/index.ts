import { FastifyPluginAsync } from 'fastify'
import { createAuthRoute } from '../../../../common/config/fastify/plugin/auth-plugins.js'
import { CommentsRequestMap } from './types.js'
import COMMENTS_SCHEMA from './schema.js'

export const commentsRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get<CommentsRequestMap['GET_COMMENT_LIST']>(
    '/',
    { schema: COMMENTS_SCHEMA.GET_COMMENT_LIST },
    async (request) => {
      return `Comments by item(${request.params.id})!`
    },
  )

  fastify.get<CommentsRequestMap['GET_SUBCOMMENT_LIST']>(
    '/:commentId',
    { schema: COMMENTS_SCHEMA.GET_SUBCOMMENT_LIST },
    async (request) => {
      return `Subcomment sublist by Comment(${request.params.commentId}) by item(${request.params.id})`
    },
  )

  fastify.register(commentsAuthRoute)
}

const commentsAuthRoute = createAuthRoute(async (fastify) => {
  fastify.post<CommentsRequestMap['CREATE_COMMENT']>(
    '/',
    { schema: COMMENTS_SCHEMA.CREATE_COMMENT },
    async (request) => {
      const { id } = request.params
      const { text } = request.body
    },
  )

  // fastify.patch<>('', { schema: XXXX }, async (request) => {
  //   //
  // })
  //
  // fastify.delete<>('', { schema: XXXX }, async (request) => {
  //   //
  // })
})
