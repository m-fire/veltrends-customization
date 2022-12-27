import { Prisma } from '@prisma/client'
import db from '../common/config/prisma/db-client.js'
import AppError from '../common/error/AppError.js'
import {
  validateEntityDeleted,
  validateMatchToUserAndOwner,
} from '../core/util/validates.js'

// prisma include conditions

class CommentRepository {
  /* Public APIs */

  // Count

  static async countCommentBy(where: Prisma.CommentWhereInput) {
    return db.comment.count({ where })
  }

  // Create

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
      include: CR.Query.includeUser(),
    })
  }

  // Read list

  static async findCommentListBy(
    { itemId, limit }: FindListByItemIdParams,
    orderBy: PrismaCommentOrderBy | PrismaCommentOrderBy[] = { id: 'desc' },
  ) {
    return db.comment.findMany({
      where: {
        itemId,
        /* Root 댓글목록은 삭제된 댓글을 포함한 모든 댓글을 출력하므로, 필더링 하지않음 */
        // deletedAt: null,
      },
      orderBy,
      include: CR.Query.includeUserAndMentionUser(),
      take: limit,
    })
  }

  static async findSubcommentListBy(
    { parentCommentId, limit }: FindListByParentCommentIdParams,
    orderBy: PrismaCommentOrderBy | PrismaCommentOrderBy[] = { id: 'asc' },
  ) {
    return db.comment.findMany({
      where: {
        parentCommentId,
        /* 삭제되지 않은 댓글만 조회(삭제날짜를 갖지 않음) */
        deletedAt: null,
      },
      orderBy,
      include: CR.Query.includeUserAndMentionUser(),
      take: limit,
    })
  }

  static async findCommentMapByIds<PS extends Prisma.CommentSelect>(
    commentIds: number[],
    select?: PS,
  ) {
    const commentList = (await db.comment.findMany({
      where: { id: { in: commentIds } },
      select: select ?? { id: true },
    })) as Prisma.CommentGetPayload<{ select: PS }>[]

    const commentByIdMap = commentList.reduce((acc, comment) => {
      acc[comment.id] = comment
      return acc
    }, {} as Record<number, typeof commentList[0]>)

    return commentByIdMap
  }

  // Read entity

  static async findCommentWithRelation<PI extends Prisma.CommentInclude>(
    commentId: number,
    include?: PI,
  ) {
    const includeUser = CR.Query.includeUser()

    const comment = (await db.comment.findUnique({
      where: { id: commentId },
      include: {
        ...includeUser /* API Schema 필수규약 이므로 반드시 포함 */,
        ...include,
      },
    })) as Prisma.CommentGetPayload<{ include: typeof includeUser & PI }> | null
    if (!comment) return null

    return comment
  }

  static async findCommentOrThrow<PI extends Prisma.CommentInclude>(
    { commentId, userId }: FindCommentOrThrowParams,
    include?: PI,
  ) {
    try {
      const includeUser = CR.Query.includeUser()

      validateEntityDeleted(commentOrNull, new AppError('NotFound'))

      // 지워진 댓글이면 찾을수 없다고 애러발생
      if (comment.deletedAt != null) throw new AppError('NotFound')

      // userId 가 없어도 조회가 되지만, 비교해야 한다면 반드시 comment.userId 와 동일해야 한다.
      if (userId != null && comment.userId !== userId)
        throw new AppError('Forbidden')

      return comment
    } catch (e) {
      if (e instanceof Prisma.NotFoundError) throw new AppError('NotFound')
      if (AppError.is(e)) throw e
    }
  }

  // 연관관계 조회가 불가능한 부분속성을 갖는 엔티티를 조회합니다.
  // 단일 엔티티 조회시 연관관계가 필요하다면 다른 메서드를 사용해야 합니다.
  static async findCommentOrPartial<QS extends Prisma.CommentSelect>(
    commentId: number,
    select?: QS,
  ) {
    const comment = (await db.comment.findUnique({
      where: { id: commentId },
      select,
    })) as Prisma.CommentGetPayload<{ select: QS }> | null

    if (!comment) return null

    return comment
  }

  // Update

    validateEqualToUserAndOwner(userId, partialComment.userId)

    return db.comment.update({
      where: { id: commentId },
      data,
      include: CR.Query.includeUser(),
    })
  }

  // Delete

    validateMatchToUserAndOwner(userId, partialComment.userId)

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
      })
    }
  }
}
export default CommentRepository

const CR = CommentRepository

// types

type CreateCommentParams = {
  itemId: number
  text: string
  userId: number
  parentCommentId?: number
  mentionUserId?: number
}

type FindListByItemIdParams = {
  itemId: number
  limit?: number
}

type FindListByParentCommentIdParams = {
  parentCommentId?: number
  limit?: number
}

type PrismaCommentOrderBy =
  | Prisma.CommentOrderByWithRelationInput
  | Prisma.CommentOrderByWithAggregationInput

type FindCommentOrThrowParams = {
  commentId: number
  userId?: number
}

type UpdateCommentDataParams = Pick<
  Prisma.CommentUpdateInput,
  'text' | 'likeCount' | 'commentLikes' | 'subcommentCount' | 'deletedAt'
>
