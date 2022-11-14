import { FastifyPluginAsync } from 'fastify'
import { createAuthRoute } from '../../../../common/config/fastify/plugin/auth-plugins.js'
import { CommentsRequestMap } from './types.js'
import COMMENTS_SCHEMA from './schema.js'

export const commentsRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get<CommentsRequestMap['GET_COMMENT_LIST']>(
    '/',
    { schema: COMMENTS_SCHEMA.GET_COMMENT_LIST },
    async (request) => {
      //
    },
  )

  fastify.get<CommentsRequestMap['GET_SUBCOMMENT_LIST']>(
    '/:commentId/subcomments',
    { schema: COMMENTS_SCHEMA.GET_SUBCOMMENT_LIST },
    async (request) => {
      //
    },
  )

  fastify.register(commentsAuthRoute)
}

const commentsAuthRoute = createAuthRoute(async (fastify) => {
  fastify.post<CommentsRequestMap['CREATE_COMMENT']>(
    '/',
    { schema: COMMENTS_SCHEMA.CREATE_COMMENT },
    async (request) => {
      //
    },
  )

  fastify.patch<CommentsRequestMap['UPDATE_COMMENT']>(
    '/:commentId',
    { schema: COMMENTS_SCHEMA.UPDATE_COMMENT },
    async (request) => {
      //
    },
  )

  fastify.delete<CommentsRequestMap['DELETE_COMMENT']>(
    '/:commentId',
    { schema: COMMENTS_SCHEMA.DELETE_COMMENT },
    async (request) => {
      //
    },
  )

  fastify.post<CommentsRequestMap['LIKE_COMMENT']>(
    '/:commentId/likes',
    async (request) => {
      //
    },
  )

  fastify.delete<CommentsRequestMap['UNLIKE_COMMENT']>(
    '/:commentId/likes',
    async (request) => {
      //
    },
  )
})
