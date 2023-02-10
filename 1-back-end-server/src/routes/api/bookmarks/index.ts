import { FastifyPluginAsyncTypebox } from '../../../core/config/fastify/types.js'
import { createAuthRoute } from '../../../core/config/fastify/plugin/auth-plugins.js'
import BookmarkService from '../../../service/BookmarkService.js'
import BookmarksSchema from './schema.js'
import { Validator } from '../../../common/util/validates.js'

const LIMIT_BOOKMARKS = 5 as const

/* Public Route */

const bookmarksRoute: FastifyPluginAsyncTypebox = async (fastify) => {
  //
  fastify.register(bookmarksAuthRoute)
}
export default bookmarksRoute

/* Authentication Route */

const bookmarksAuthRoute = createAuthRoute(async (fastify) => {
  fastify.post(
    '/',
    { schema: BookmarksSchema.Mark },
    async (request, reply) => {
      const { id: userId } = Validator.Auth.getValidUser(request.user)
      const { itemId } = request.body

      const newBookmark = await BookmarkService.mark({ userId, itemId })
      reply.status(201)
      return newBookmark
    },
  )

  fastify.delete(
    '/',
    { schema: BookmarksSchema.Unmark },
    async (request, reply) => {
      const { id: userId } = Validator.Auth.getValidUser(request.user)
      const { itemId } = request.query

      await BookmarkService.unmark({ itemId, userId })
      reply.status(204)
    },
  )

  /* Bookmark API 는 다른 라우트와 다르게 GET 메서드에서도 인증을 요구한다. */
  fastify.get(
    '/',
    { schema: BookmarksSchema.GetBookmarkList },
    async (request, reply) => {
      const { id: userId } = Validator.Auth.getValidUser(request.user)
      const { cursor } = request.query

      const bookmarksPage = await BookmarkService.getBookmarkList({
        userId,
        cursor,
        limit: LIMIT_BOOKMARKS,
      })
      return bookmarksPage
    },
  )
})
