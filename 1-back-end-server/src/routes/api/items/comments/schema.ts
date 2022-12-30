import { Type } from '@sinclair/typebox'
import { Nullable } from '../../../../common/config/typebox/type-util.js'
import { createFastifySchemaMap } from '../../../../common/config/typebox/schema-util.js'
import ITEMS_SCHEMA from '../schema.js'
import { RES_AUTH_USER_INFO_SCHEMA } from '../../auth/schema.js'

// Request

const REQ_COMMENT_CREATE_BODY_SCHEMA = Type.Object({
  text: Type.String(),
  parentCommentId: Type.Optional(Nullable(Type.Integer())),
})

const REQ_COMMENT_PATH_PARAMS_SCHEMA = Type.Object({
  id: Type.Integer(),
  commentId: Type.Integer(),
})

const REQ_COMMENT_EDIT_BODY_SCHEMA = Type.Object({
  text: Type.String(),
})

// Response

const COMMENT_SCHEMA = Type.Object({
  id: Type.Integer(),
  text: Type.String(),
  likeCount: Type.Number(),
  subcommentCount: Type.Number(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
  user: RES_AUTH_USER_INFO_SCHEMA,
  mentionUser: Type.Optional(Nullable(RES_AUTH_USER_INFO_SCHEMA)),
  isDeleted: Type.Boolean(),
  isLiked: Type.Boolean(),
})

const RES_COMMENT_SCHEMA = Type.Object({
  ...COMMENT_SCHEMA.properties,
  subcommentList: Type.Optional(Type.Array(COMMENT_SCHEMA)),
})

const RES_COMMENT_LIKE_SCHEMA = Type.Object({
  id: Type.Integer(),
  likeCount: Type.Number(),
})

const RES_EMPTY_OBJECT_SCHEMA = Type.Object({})

// FastifySchema

const COMMENTS_SCHEMA = createFastifySchemaMap({
  CREATE_COMMENT: {
    tags: ['items/:id/comments'],
    params: ITEMS_SCHEMA.GET_ITEM.params,
    body: REQ_COMMENT_CREATE_BODY_SCHEMA,
    response: {
      201: RES_COMMENT_SCHEMA,
    },
  },
  GET_COMMENT: {
    tags: ['items/:id/comments'],
    params: REQ_COMMENT_PATH_PARAMS_SCHEMA,
    response: {
      200: RES_COMMENT_SCHEMA,
    },
  },
  GET_COMMENT_LIST: {
    tags: ['items/:id/comments'],
    params: ITEMS_SCHEMA.GET_ITEM.params,
    response: {
      200: Type.Array(RES_COMMENT_SCHEMA),
    },
  },
  GET_SUBCOMMENT_LIST: {
    tags: ['items/:id/comments'],
    params: REQ_COMMENT_PATH_PARAMS_SCHEMA,
    response: {
      200: Type.Array(RES_COMMENT_SCHEMA),
    },
  },
  EDIT_COMMENT: {
    tags: ['items/:id/comments'],
    params: REQ_COMMENT_PATH_PARAMS_SCHEMA,
    body: REQ_COMMENT_EDIT_BODY_SCHEMA,
    response: {
      202: RES_COMMENT_SCHEMA,
    },
  },
  DELETE_COMMENT: {
    tags: ['items/:id/comments'],
    params: REQ_COMMENT_PATH_PARAMS_SCHEMA,
    response: {
      204: RES_EMPTY_OBJECT_SCHEMA,
    },
  },
  LIKE_COMMENT: {
    tags: ['items/:id/comments/:id/likes'],
    params: REQ_COMMENT_PATH_PARAMS_SCHEMA,
    response: {
      200: RES_COMMENT_LIKE_SCHEMA,
    },
  },
  UNLIKE_COMMENT: {
    tags: ['items/:id/comments/:id/likes'],
    params: REQ_COMMENT_PATH_PARAMS_SCHEMA,
    response: {
      200: RES_COMMENT_LIKE_SCHEMA,
    },
  },
})

export default COMMENTS_SCHEMA
