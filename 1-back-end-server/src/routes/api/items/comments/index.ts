import { FastifyPluginAsync } from 'fastify'
import { createAuthRoute } from '../../../../common/config/fastify/plugin/auth-plugins.js'
import { CommentsRequestMap } from './types.js'
import COMMENTS_SCHEMA from './schema.js'
import CommentService from '../../../../service/CommentService.js'
import { Validator } from '../../../../common/util/validates.js'

export const commentsRoute: FastifyPluginAsync = async (fastify) => {
  const commentService = CommentService.getInstance()

  fastify.get<CommentsRequestMap['GET_COMMENT']>(
    '/:commentId',
    { schema: COMMENTS_SCHEMA.GET_COMMENT },
    async (request, reply) => {
      return commentService.getCommentOrNull({
        commentId: request.params.commentId,
        withSubcomments: true,
        userId: request.user?.id ?? null,
      })
    },
  )

  fastify.get<CommentsRequestMap['GET_COMMENT_LIST']>(
    '/',
    { schema: COMMENTS_SCHEMA.GET_COMMENT_LIST },
    async (request, reply) => {
      return commentService.getCommentList({
        itemId: request.params.id,
        userId: request.user?.id ?? null,
      })
    },
  )

  fastify.get<CommentsRequestMap['GET_SUBCOMMENT_LIST']>(
    '/:commentId/subcomments',
    { schema: COMMENTS_SCHEMA.GET_SUBCOMMENT_LIST },
    async (request, reply) => {
      return commentService.getSubcommentList({
        parentCommentId: request.params.commentId,
        userId: request.user?.id ?? null,
      })
    },
  )

  fastify.register(commentsAuthRoute)
}

// AuthRoute

const commentsAuthRoute = createAuthRoute(async (fastify) => {
  const commentService = CommentService.getInstance()

  fastify.post<CommentsRequestMap['CREATE_COMMENT']>(
    '/',
    { schema: COMMENTS_SCHEMA.CREATE_COMMENT },
    async (request, reply) => {
      const { id: userId } = Validator.Auth.getValidUser(request.user)

      const newComment = await commentService.createComment({
        itemId: request.params.id,
        userId,
        text: request.body.text,
        parentCommentId: request.body.parentCommentId ?? null,
      })

      reply.status(201)
      return newComment
    },
  )

  fastify.patch<CommentsRequestMap['UPDATE_COMMENT']>(
    '/:commentId',
    { schema: COMMENTS_SCHEMA.UPDATE_COMMENT },
    async (request, reply) => {
      const { id: userId } = Validator.Auth.getValidUser(request.user)

      const updatedComment = await commentService.updateComment({
        commentId: request.params.commentId,
        userId,
        text: request.body.text,
      })

      reply.status(202)
      return updatedComment
    },
  )

  fastify.delete<CommentsRequestMap['DELETE_COMMENT']>(
    '/:commentId',
    { schema: COMMENTS_SCHEMA.DELETE_COMMENT },
    async (request, reply) => {
      const { id: userId } = Validator.Auth.getValidUser(request.user)

      reply.status(204)
      await commentService.deleteComment({
        commentId: request.params.commentId,
        userId,
      })
    },
  )

  fastify.post<CommentsRequestMap['LIKE_COMMENT']>(
    '/:commentId/likes',
    { schema: COMMENTS_SCHEMA.LIKE_COMMENT },
    async (request, reply) => {
      const { id: userId } = Validator.Auth.getValidUser(request.user)
      const { commentId } = request.params

      const likeCount = await commentService.likeComment({ commentId, userId })
      reply.status(202)
      return { id: commentId, likeCount }
    },
  )

  fastify.delete<CommentsRequestMap['UNLIKE_COMMENT']>(
    '/:commentId/likes',
    { schema: COMMENTS_SCHEMA.UNLIKE_COMMENT },
    async (request, reply) => {
      const { id: userId } = Validator.Auth.getValidUser(request.user)
      const { commentId } = request.params

      const likeCount = await commentService.unlikeComment({
        commentId,
        userId,
      })
      reply.status(202)
      return { id: commentId, likeCount }
    },
  )
})
