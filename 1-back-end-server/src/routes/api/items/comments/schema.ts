import { Type } from '@sinclair/typebox'
import { Nullable } from '../../../../common/config/typebox/type-util.js'
import { createFastifySchemaMap } from '../../../../common/config/typebox/schema-util.js'
import ITEMS_SCHEMA from '../schema.js'
import { RES_AUTH_USER_INFO_SCHEMA } from '../../auth/schema.js'

// Request

const REQ_COMMENT_CREATE_BODY_SCHEMA = Type.Object({
  text: Type.String(),
  parentCommentId: Type.Optional(Nullable(Type.Integer({ default: 32 }))),
})

const REQ_COMMENT_PATH_PARAMS_SCHEMA = Type.Object({
  id: Type.Integer({ default: 13 }),
  commentId: Type.Integer({ default: 32 }),
})

const REQ_COMMENT_UPDATE_BODY_SCHEMA = Type.Object({
  text: Type.String({ default: 'updated_comment_text' }),
})

// Response

const COMMENT_SCHEMA = Type.Object({
  id: Type.Integer({ default: 11 }),
  text: Type.String({ default: 'example_comment_text' }),
  likeCount: Type.Number({ default: 3 }),
  subcommentCount: Type.Number({ default: 7 }),
  createdAt: Type.String({ default: '2022-10-15T23:16:21.901Z' }),
  updatedAt: Type.String({ default: '2022-10-15T23:16:21.901Z' }),
  user: RES_AUTH_USER_INFO_SCHEMA,
  mentionUser: Type.Optional(Nullable(RES_AUTH_USER_INFO_SCHEMA)),
})

const RES_COMMENT_SCHEMA = Type.Object({
  ...COMMENT_SCHEMA.properties,
  subcommentList: Type.Optional(Type.Array(COMMENT_SCHEMA)),
  isDeleted: Type.Boolean({ default: false }),
})

const RES_COMMENT_LIKE_SCHEMA = Type.Object({
  id: Type.Integer(),
  likeCount: Type.Number(),
})

// FastifySchema

const COMMENTS_SCHEMA = createFastifySchemaMap({
  CREATE_COMMENT: {
    params: ITEMS_SCHEMA.GET_ITEM.params,
    body: REQ_COMMENT_CREATE_BODY_SCHEMA,
    response: {
      201: RES_COMMENT_SCHEMA,
    },
  },
  GET_COMMENT: {
    params: REQ_COMMENT_PATH_PARAMS_SCHEMA,
    response: {
      200: RES_COMMENT_SCHEMA,
    },
  },
  GET_COMMENT_LIST: {
    params: ITEMS_SCHEMA.GET_ITEM.params,
    response: {
      200: Type.Array(RES_COMMENT_SCHEMA),
    },
  },
  GET_SUBCOMMENT_LIST: {
    params: REQ_COMMENT_PATH_PARAMS_SCHEMA,
    response: {
      200: Type.Array(RES_COMMENT_SCHEMA),
    },
  },
  UPDATE_COMMENT: {
    params: REQ_COMMENT_PATH_PARAMS_SCHEMA,
    body: REQ_COMMENT_UPDATE_BODY_SCHEMA,
    response: {
      202: RES_COMMENT_SCHEMA,
    },
  },
  DELETE_COMMENT: {
    params: REQ_COMMENT_PATH_PARAMS_SCHEMA,
    response: {
      204: {},
    },
  },
  LIKE_COMMENT: {
    params: REQ_COMMENT_PATH_PARAMS_SCHEMA,
    response: {
      200: RES_COMMENT_LIKE_SCHEMA,
    },
  },
  UNLIKE_COMMENT: {
    params: REQ_COMMENT_PATH_PARAMS_SCHEMA,
    response: {
      200: RES_COMMENT_LIKE_SCHEMA,
    },
  },
} as const)

export default COMMENTS_SCHEMA
