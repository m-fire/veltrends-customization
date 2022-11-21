import db from '../common/config/prisma/db-client.js'
import { Comment } from '@prisma/client'
import AppError from '../common/error/AppError.js'
import CommentLikeService from './CommentLikeService.js'
import ItemStatusService from './ItemStatusService.js'

// prisma include conditions
const INCLUDE_SIMPLE_USER = { select: { id: true, username: true } } as const

class CommentService {
  private static instance: CommentService
  private commentLikeService = CommentLikeService.getInstance()
  private itemStatusSerivce = ItemStatusService.getInstance()

  static getInstance() {
    if (!CommentService.instance) {
      CommentService.instance = new CommentService()
    }
    return CommentService.instance
  }

  private constructor() {}

  async createComment({
    itemId,
    userId,
    text,
    parentCommentId,
  }: CreateCommentParams) {
    const parentComment =
      parentCommentId != null ? await this.getComment(parentCommentId) : null
    const rootId = parentComment?.parentCommentId
    const parentId = rootId ?? parentCommentId
    const metionUserId = parentComment?.userId

    const shouldMentionUser = rootId != null && metionUserId != null
    const isSubcomment = parentId != null

    const newComment = await db.comment.create({
      data: {
        itemId,
        text,
        userId,
        parentCommentId: isSubcomment ? parentId : null,
        mentionUserId: shouldMentionUser ? metionUserId : null,
      },
      include: { user: INCLUDE_SIMPLE_USER },
    })

    // 하위댓글 인 경우, subcommentCount 증가 후, 댓글 수 동기화
    if (isSubcomment) {
      const subcommentCount = await db.comment.count({
        where: { parentCommentId: parentId },
      })
      await db.comment.update({
        where: { id: parentId },
        data: { subcommentCount },
      })
    }

    await this.syncCommentCount(itemId)

    return { ...newComment, subcommentList: [] }
  }

  async getCommentList(itemId: number) {
    const commentList = await db.comment.findMany({
      where: { itemId },
      orderBy: { id: 'asc' },
      include: {
        user: INCLUDE_SIMPLE_USER,
        mentionUser: INCLUDE_SIMPLE_USER,
      },
    })
    // normalize ation 가공
    const normalizedList = this.normalizeDeletedComment(commentList)
    const composedCommentList = await this.composeSubcomments(normalizedList)
    return composedCommentList
  }

  private normalizeDeletedComment(comments: Comment[]) {
    return comments.map((c) => {
      if (!c.deletedAt) return c

      const someDate = new Date(0)
      return {
        ...c,
        text: '',
        likes: 0,
        subcommentCount: 0,
        createdAt: someDate,
        updatedAt: someDate,
        user: {
          id: -1,
          username: 'deleted',
        },
        mentionUser: null,
        subcommentList: [],
      }
    })
  }

  private async composeSubcomments(comments: Comment[]) {
    const rootCommentList = comments.filter((c) => c.parentCommentId === null)
    const commentsByParentIdMap = new Map<number, Comment[]>()

    comments.forEach((c) => {
      if (!c.parentCommentId) return
      const subcommentList = commentsByParentIdMap.get(c.parentCommentId) ?? []
      subcommentList.push(c)
      commentsByParentIdMap.set(c.parentCommentId, subcommentList)
    })
    const commentsWithSubcomments = rootCommentList.map((parent) => ({
      ...parent,
      subcommentList: commentsByParentIdMap.get(parent.id) ?? [],
    }))

    return commentsWithSubcomments
  }

  async getComment(commentId: number, includeSubcomments: boolean = false) {
    const comment = await db.comment.findUnique({
      where: { id: commentId },
      include: {
        user: INCLUDE_SIMPLE_USER,
        mentionUser: INCLUDE_SIMPLE_USER,
      },
    })
    if (!comment || comment.deletedAt) throw new AppError('NotFoundError')
    if (!includeSubcomments) return comment

    const subcommentList = await this.getSubcommentList(commentId)
    return { ...comment, subcommentList }
  }

  async getSubcommentList(parentId: number) {
    return db.comment.findMany({
      where: { parentCommentId: parentId },
      orderBy: { id: 'asc' },
      include: {
        user: INCLUDE_SIMPLE_USER,
        mentionUser: INCLUDE_SIMPLE_USER,
      },
    })
  }

  async updateComment({ commentId, userId, text }: UpdateCommentParams) {
    const comment = await this.getComment(commentId)
    if (comment!.id !== commentId) new AppError('ForbiddenError')

    await db.comment.update({
      where: { id: commentId },
      data: { text },
      include: { user: INCLUDE_SIMPLE_USER },
    })
    return this.getComment(commentId, true)
  }

  async deleteComment({ commentId, userId }: CommentParams) {
    const comment = await this.getComment(commentId)
    if (comment!.id !== commentId) new AppError('ForbiddenError')

    await db.comment.delete({ where: { id: commentId } })

    await this.syncCommentCount(comment.itemId)
  }

  async likeComment({ commentId, userId }: CommentLikesParams) {
    const likes = await this.commentLikeService.like({ commentId, userId })
    await this.syncLikes({ commentId, likes })
    return likes
  }

  async unlikeComment({ commentId, userId }: CommentLikesParams) {
    const likes = await this.commentLikeService.unlike({ commentId, userId })
    await this.syncLikes({ commentId, likes })
    return likes
  }

  private async syncLikes({ commentId, likes }: UpdateLikesParams) {
    await db.comment.update({
      data: { likes },
      where: { id: commentId },
    })
  }

  private async syncCommentCount(itemId: number) {
    const commentCount = await db.comment.count({
      where: { itemId },
    })
    await this.itemStatusSerivce.updateCommentCount({
      itemId,
      commentCount,
    })
  }
}
export default CommentService

// types

type CreateCommentParams = {
  itemId: number
  userId: number
  text: string
  parentCommentId?: number
}

export type CommentParams = {
  commentId: number
  userId: number
}

type UpdateCommentParams = CommentParams & {
  text: string
}

type UpdateLikesParams = { commentId: number; likes: number }

export type CommentLikesParams = {
  commentId: number
  userId: number
}
