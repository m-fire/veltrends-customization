import { FastifyPluginAsync } from 'fastify'
import { createAuthRoute } from '../../../../common/config/fastify/plugin/auth-plugins.js'
import { CommentsRequestMap } from './types.js'
import COMMENTS_SCHEMA from './schema.js'
import CommentService from '../../../../service/CommentService.js'

export const commentsRoute: FastifyPluginAsync = async (fastify) => {
  const commentService = CommentService.getInstance()

  fastify.get<CommentsRequestMap['GET_COMMENT']>(
    '/:commentId',
    { schema: COMMENTS_SCHEMA.GET_COMMENT },
    async (request, reply) => {
      const { commentId } = request.params
      return commentService.getComment(commentId, true)
    },
  )

  fastify.get<CommentsRequestMap['GET_COMMENT_LIST']>(
    '/',
    { schema: COMMENTS_SCHEMA.GET_COMMENT_LIST },
    async (request, reply) => {
      const { id: itemId } = request.params
      return commentService.getCommentList(itemId)
    },
  )

  fastify.get<CommentsRequestMap['GET_SUBCOMMENT_LIST']>(
    '/:commentId/subcomments',
    { schema: COMMENTS_SCHEMA.GET_SUBCOMMENT_LIST },
    async (request, reply) => {
      const { commentId: parentId } = request.params
      return commentService.getSubcommentList(parentId)
    },
  )

  fastify.register(commentsAuthRoute)
}

const commentsAuthRoute = createAuthRoute(async (fastify) => {
  const commentService = CommentService.getInstance()

  fastify.post<CommentsRequestMap['CREATE_COMMENT']>(
    '/',
    { schema: COMMENTS_SCHEMA.CREATE_COMMENT },
    async (request, reply) => {
      const {
        params: { id: itemId },
        body: { text, parentCommentId },
        user,
      } = request
      reply.status(201)
      return await commentService.createComment({
        itemId,
        userId: user!.id,
        text,
        parentCommentId: parentCommentId ?? undefined,
      })
    },
  )

  fastify.patch<CommentsRequestMap['UPDATE_COMMENT']>(
    '/:commentId',
    { schema: COMMENTS_SCHEMA.UPDATE_COMMENT },
    async (request, reply) => {
      const {
        params: { commentId },
        body: { text },
        user,
      } = request
      reply.status(202)
      return commentService.updateComment({
        commentId,
        userId: user!.id,
        text,
      })
    },
  )

  fastify.delete<CommentsRequestMap['DELETE_COMMENT']>(
    '/:commentId',
    { schema: COMMENTS_SCHEMA.DELETE_COMMENT },
    async (request, reply) => {
      const {
        params: { commentId },
        user,
      } = request
      reply.status(204)
      await commentService.deleteComment({ commentId, userId: user!.id })
    },
  )

  fastify.post<CommentsRequestMap['LIKE_COMMENT']>(
    '/:commentId/likes',
    { schema: COMMENTS_SCHEMA.LIKE_COMMENT },
    async (request, reply) => {
      const {
        params: { commentId },
        user,
      } = request
      reply.status(202)
      const likeCount = await commentService.likeComment({
        commentId,
        userId: user!.id,
      })
      return { id: commentId, likeCount }
    },
  )

  fastify.delete<CommentsRequestMap['UNLIKE_COMMENT']>(
    '/:commentId/likes',
    { schema: COMMENTS_SCHEMA.UNLIKE_COMMENT },
    async (request, reply) => {
      const {
        params: { commentId },
        user,
      } = request
      reply.status(202)
      const likeCount = await commentService.unlikeComment({
        commentId,
        userId: user!.id,
      })
      return { id: commentId, likeCount }
    },
  )
})
