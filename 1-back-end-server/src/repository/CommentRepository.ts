import { Prisma } from '@prisma/client'
import db from '../core/config/prisma/index.js'
import AppError from '../common/error/AppError.js'
import {
  isDeletedEntity,
  validateMatchUserToOwner,
} from '../core/util/validates.js'

// prisma include conditions

class CommentRepository {
  /* Public APIs */

  /* Count */

  static async countCommentBy(query: Prisma.CommentCountArgs) {
    return db.comment.count({ ...query })
  }

  /* Create */

  static async createComment({
    itemId,
    text,
    userId,
    parentCommentId,
    mentionUserId,
  }: CreateCommentParams) {
    return db.comment.create({
      data: {
        itemId,
        text,
        userId,
        parentCommentId,
        mentionUserId,
      },
      include: CR.Query.includeUserAndMentionUser(),
    })
  }

  /* Read list */

  static async findCommentListBy<Q extends CommentFindManyQuery>(
    { itemId }: FindListByItemIdParams,
    query: Q,
  ) {
    return db.comment.findMany({
      where: {
        itemId /* Root 댓글목록은 삭제된 댓글을 포함한 모든 댓글을 출력하므로, 필더링 하지않음 */,
        // deletedAt: null,
      },
      ...{
        ...query,
        include: CR.Query.includeUserAndMentionUser(),
      },
    })
  }

  static async findSubcommentListBy<Q extends CommentFindManyQuery>(
    { parentCommentId }: FindListByParentCommentIdParams,
    query: Q,
  ) {
    return db.comment.findMany({
      where: {
        parentCommentId,
        deletedAt: null, //삭제되지 않은 댓글만 조회(정상 댓글은 삭제날짜 없음)
      },
      ...{
        ...query,
        include: CR.Query.includeUserAndMentionUser(),
      },
    })
  }

  static async findCommentMapByIds<Q extends CommentFindManyQuery>(
    commentIds: number[],
    query?: Q,
  ) {
    const commentList = (await db.comment.findMany({
      where: { id: { in: commentIds } },
      ...{
        ...query,
        select: query?.select ?? { id: true },
      },
    })) as Prisma.CommentGetPayload<Q>[]

    const commentByIdMap = commentList.reduce((acc, comment) => {
      acc[comment.id] = comment
      return acc
    }, {} as Record<number, (typeof commentList)[0]>)

    return commentByIdMap
  }

  /* Read entity */

  static async findCommentOrNull<Q extends CommentFindUniqueQuery>(
    commentId: number,
    query?: Q,
  ) {
    try {
      const includeUser = CR.Query.includeUser()
      const comment = (await db.comment.findUnique({
        where: { id: commentId },
        ...{
          ...query,
          include: {
            ...query?.include,
            ...includeUser /* API Schema 필수규약 이므로 반드시 포함 */,
          },
        },
      })) as Prisma.CommentGetPayload<
        Q extends undefined
          ? { include: typeof includeUser }
          : Q & {
              include: Q['include'] extends undefined
                ? typeof includeUser
                : Q['include'] & typeof includeUser
            }
      >

      if (isDeletedEntity(comment)) throw new AppError('NotFound')

      return comment as typeof comment | never
    } catch (e) {
      if (e instanceof Prisma.NotFoundError) {
        throw new AppError('NotFound')
      } else if (AppError.is(e)) {
        throw e
      }
      console.error(e)
    }
  }

  static async findPartialCommentOrNull<Q extends CommentFindUniqueQuery>(
    commentId: number,
    query?: Q,
  ) {
    try {
      const comment = await db.comment.findUnique({
        where: { id: commentId },
        ...query,
      })

      return comment as Prisma.CommentGetPayload<Q> | never
    } catch (e) {
      if (e instanceof Prisma.NotFoundError) {
        throw new AppError('NotFound')
      } else if (AppError.is(e)) {
        throw e
      }
      console.error(e)
    }
  }

  /* Update */

  static async updateComment(
    commentId: number,
    {
      userId,
      text,
      likeCount,
      commentLikes,
      subcommentCount,
    }: UpdateCommentDataParams,
  ) {
    const partialComment = await CR.findPartialCommentOrNull(commentId, {
      select: { userId: true },
    })
    if (partialComment == null) throw new AppError('NotFound')
    if (!validateMatchUserToOwner(userId, partialComment?.userId))
      throw new AppError('Forbidden')

    return db.comment.update({
      where: { id: commentId },
      data: {
        text,
        likeCount,
        commentLikes,
        subcommentCount,
      },
      include: CR.Query.includeUser(),
    })
  }

  /* Delete */

  static async deleteComment({
    commentId,
    userId,
  }: {
    commentId: number
    userId: number
  }) {
    const partialComment = await CR.findPartialCommentOrNull(commentId, {
      select: { userId: true },
    })
    if (partialComment == null) throw new AppError('NotFound')

    validateMatchUserToOwner(userId, partialComment.userId)

    // Todo: 해당 row삭제가 아닌 deletedAt 값을 Date.now() update 형태로 삭제구현
    // 실제로 row 삭제
    return db.comment.delete({ where: { id: commentId } })
  }

  // Query option

  static Query = class CommentsQueryClause {
    static includeUser() {
      return Prisma.validator<Prisma.CommentInclude>()({
        user: { select: { id: true, username: true } },
      })
    }

    static includeUserAndMentionUser() {
      return Prisma.validator<Prisma.CommentInclude>()({
        user: { select: { id: true, username: true } },
        mentionUser: { select: { id: true, username: true } },
        // user: { select: { id: true, username: true } },
        // mentionUser: { select: { id: true, username: true } },
      })
    }
  }
}
export default CommentRepository

const CR = CommentRepository

// types

export type CommentFindManyQuery = Omit<Prisma.CommentFindManyArgs, 'where'>
export type CommentFindUniqueQuery = Omit<Prisma.CommentFindUniqueArgs, 'where'>

type CreateCommentParams = {
  itemId: number
  text: string
  userId: number
  parentCommentId?: number
  mentionUserId?: number
}

type FindListByItemIdParams = {
  itemId: number
}

type FindListByParentCommentIdParams = {
  parentCommentId?: number
}

type UpdateCommentDataParams = { userId?: number } & Pick<
  Prisma.CommentUpdateInput,
  'text' | 'likeCount' | 'commentLikes' | 'subcommentCount'
>
