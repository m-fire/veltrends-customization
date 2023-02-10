import { FastifyPluginAsyncTypebox } from '../../../../core/config/fastify/types.js'
import { createAuthRoute } from '../../../../core/config/fastify/plugin/auth-plugins.js'
import CommentsSchema from './schema.js'
import CommentService from '../../../../service/CommentService.js'
import { Validator } from '../../../../common/util/validates.js'

export const commentsRoute: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    '/',
    { schema: CommentsSchema.GetCommentList },
    async (request, reply) => {
      return CommentService.getAllCommentList({
        itemId: request.params.id,
        userId: request.user?.id ?? null,
      })
    },
  )

  fastify.get(
    '/:commentId',
    { schema: CommentsSchema.GetComment },
    async (request, reply) => {
      return CommentService.getCommentIncludeSubList({
        commentId: request.params.commentId,
        userId: request.user?.id ?? null,
        withSubcomments: true,
      })
    },
  )

  fastify.get(
    '/:commentId/subcomments',
    { schema: CommentsSchema.GetSubcommentList },
    async (request, reply) => {
      return CommentService.getSubcommentList({
        parentCommentId: request.params.commentId,
        userId: request.user?.id ?? null,
      })
    },
  )

  fastify.register(commentsAuthRoute)
}

// AuthRoute

const commentsAuthRoute = createAuthRoute(async (fastify) => {
  fastify.post(
    '/',
    { schema: CommentsSchema.CREATE_COMMENT },
    async (request, reply) => {
      const { id: userId } = Validator.Auth.getValidUser(request.user)
      const { text, parentCommentId } = request.body

      const newComment = await CommentService.createComment({
        itemId: request.params.id,
        userId,
        text,
        parentCommentId: parentCommentId ?? undefined,
      })

      reply.status(201)
      return newComment
    },
  )

  fastify.patch(
    '/:commentId',
    { schema: CommentsSchema.EDIT_COMMENT },
    async (request, reply) => {
      const { id: userId } = Validator.Auth.getValidUser(request.user)

      const updatedComment = await CommentService.editComment({
        commentId: request.params.commentId,
        userId,
        text: request.body.text,
      })

      reply.status(202)
      return updatedComment
    },
  )

  fastify.delete(
    '/:commentId',
    { schema: CommentsSchema.DELETE_COMMENT },
    async (request, reply) => {
      const { id: userId } = Validator.Auth.getValidUser(request.user)

      reply.status(204)
      await CommentService.deleteComment({
        commentId: request.params.commentId,
        userId,
      })
    },
  )

  fastify.post(
    '/:commentId/likes',
    { schema: CommentsSchema.LIKE_COMMENT },
    async (request, reply) => {
      const { id: userId } = Validator.Auth.getValidUser(request.user)
      const { commentId } = request.params

      const likeCount = await CommentService.likeComment({ commentId, userId })
      reply.status(202)
      return { id: commentId, likeCount }
    },
  )

  fastify.delete(
    '/:commentId/likes',
    { schema: CommentsSchema.UNLIKE_COMMENT },
    async (request, reply) => {
      const { id: userId } = Validator.Auth.getValidUser(request.user)
      const { commentId } = request.params

      const likeCount = await CommentService.unlikeComment({
        commentId,
        userId,
      })
      reply.status(202)
      return { id: commentId, likeCount }
    },
  )
})
