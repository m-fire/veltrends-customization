import { FastifyPluginAsync } from 'fastify'
import { createAuthRoute } from '../../../common/config/fastify/plugin/auth-plugins.js'
import BookmarkService from '../../../service/BookmarkService.js'
import { BookmarksRequestMap } from './types.js'
import BOOKMARKS_SCHEMA from './schema.js'
import { Validator } from '../../../common/util/validates.js'

const LIMIT_BOOKMARKS = 5 as const

/* Public Route */

const bookmarksRoute: FastifyPluginAsync = async (fastify) => {
  //
  fastify.register(bookmarksAuthRoute)
}
export default bookmarksRoute

/* Authentication Route */

const bookmarksAuthRoute = createAuthRoute(async (fastify) => {
  const bookmarkService = BookmarkService.getInstance()

  fastify.post<BookmarksRequestMap['MARK']>(
    '/',
    { schema: BOOKMARKS_SCHEMA.MARK },
    async (request, reply) => {
      const { id: userId } = Validator.Auth.getValidUser(request.user)
      const { itemId } = request.body

      const newBookmark = await bookmarkService.mark({ userId, itemId })
      reply.statusCode = 201
      return newBookmark
    },
  )

  fastify.delete<BookmarksRequestMap['UNMARK']>(
    '/:bookmarkId',
    { schema: BOOKMARKS_SCHEMA.UNMARK },
    async (request, reply) => {
      const { id: userId } = Validator.Auth.getValidUser(request.user)
      const { bookmarkId } = request.params

      await bookmarkService.unmark({ bookmarkId, userId })
      reply.statusCode = 204
    },
  )

  /* Bookmark API 는 다른 라우트와 다르게 GET 메서드에서도 인증을 요구한다. */
  fastify.get<BookmarksRequestMap['GET_BOOKMARK_LIST']>(
    '/',
    { schema: BOOKMARKS_SCHEMA.GET_BOOKMARK_LIST },
    async (request, reply) => {
      const { id: userId } = Validator.Auth.getValidUser(request.user)
      const { cursor } = request.query

      const bookmarksPage = await bookmarkService.getBookmarkList({
        userId,
        cursor,
        limit: LIMIT_BOOKMARKS,
      })
      return bookmarksPage
    },
  )
})
