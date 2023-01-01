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

  /* Count */

  static async countCommentBy(where: Prisma.CommentWhereInput) {
    return db.comment.count({ where })
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
      include: CR.Query.includeUser(),
    })
  }

  /* Read list */

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
        deletedAt: null, //삭제되지 않은 댓글만 조회(정상 댓글은 삭제날짜 없음)
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

  /* Read entity */

  static async findCommentOrNull<PI extends Prisma.CommentInclude>(
    commentId: number,
    include?: PI,
  ) {
    const includeUser = CR.Query.includeUser()

    return (await db.comment.findUnique({
      where: { id: commentId },
      include: {
        ...include,
        ...includeUser /* API Schema 필수규약 이므로 반드시 포함 */,
      },
    })) as Prisma.CommentGetPayload<{ include: typeof includeUser & PI }> | null
  }

  static async findCommentOrThrow<PI extends Prisma.CommentInclude>(
    commentId: number,
    include?: PI,
  ) {
    try {
      const commentOrNull = await CR.findCommentOrNull(commentId, include)

      validateEntityDeleted(commentOrNull, new AppError('NotFound'))

      return commentOrNull
    } catch (e) {
      if (e instanceof Prisma.NotFoundError) throw new AppError('NotFound')
      if (AppError.is(e)) throw e
    }
  }

  // 연관관계 조회가 불가능한 부분속성을 갖는 엔티티를 조회합니다.
  // 단일 엔티티 조회시 연관관계가 필요하다면 다른 메서드를 사용해야 합니다.
  static async findPartialCommentOrNull<QS extends Prisma.CommentSelect>(
    commentId: number,
    select?: QS,
  ) {
    return (await db.comment.findUnique({
      where: { id: commentId },
      select,
    })) as Prisma.CommentGetPayload<{ select: QS }> | null
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
      userId: true,
    })
    if (partialComment == null) throw new AppError('NotFound')

    validateMatchToUserAndOwner(userId, partialComment.userId)

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
      userId: true,
    })
    if (partialComment == null) throw new AppError('NotFound')

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

type UpdateCommentDataParams = { userId?: number } & Pick<
  Prisma.CommentUpdateInput,
  'text' | 'likeCount' | 'commentLikes' | 'subcommentCount'
>
