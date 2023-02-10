import { Type } from '@sinclair/typebox'
import { Nullable } from '../../../../core/config/typebox/types.js'
import { routeSchemaMap } from '../../../../core/config/typebox/schema-util.js'
import Items from '../schema.js'
import { RES_AUTH_USER_INFO } from '../../auth/schema.js'
import {
  RouteRequestMap,
  RouteResponseCodeMap,
} from '../../../../core/config/fastify/types.js'

// Request

const REQ_COMMENT_PATH_PARAMS_SCHEMA = Type.Object({
  id: Type.Integer(),
  commentId: Type.Integer(),
})

// Response

const RES_COMMENT_SIMPLE_SCHEMA = Type.Object({
  id: Type.Integer(),
  text: Type.String(),
  likeCount: Type.Number(),
  subcommentCount: Type.Number(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
  user: RES_AUTH_USER_INFO,
  mentionUser: Nullable(RES_AUTH_USER_INFO),
  isDeleted: Type.Boolean(),
  isLiked: Type.Boolean(),
})

const RES_COMMENT_TREE_SCHEMA = Type.Object({
  ...RES_COMMENT_SIMPLE_SCHEMA.properties,
  subcommentList: Type.Array(RES_COMMENT_SIMPLE_SCHEMA),
})

const RES_COMMENT_LIKED_SCHEMA = Type.Object({
  id: Type.Integer(),
  likeCount: Type.Number(),
})

// FastifySchema

const COMMENTS_SCHEMA = routeSchemaMap(['items', 'comments'], {
  CREATE_COMMENT: {
    params: Items.GetItem.params,
    body: Type.Object({
      text: Type.String(),
      parentCommentId: Nullable(Type.Integer()),
    }),
    response: {
      201: RES_COMMENT_SIMPLE_SCHEMA,
    },
  },

  GetComment: {
    params: REQ_COMMENT_PATH_PARAMS_SCHEMA,
    response: {
      200: Nullable(RES_COMMENT_TREE_SCHEMA),
    },
  },

  GetCommentList: {
    params: Items.GetItem.params,
    response: {
      200: Type.Array(RES_COMMENT_TREE_SCHEMA),
    },
  },

  GetSubcommentList: {
    params: REQ_COMMENT_PATH_PARAMS_SCHEMA,
    response: {
      200: Type.Array(RES_COMMENT_SIMPLE_SCHEMA),
    },
  },

  EDIT_COMMENT: {
    params: REQ_COMMENT_PATH_PARAMS_SCHEMA,
    body: Type.Object({
      text: Type.String(),
    }),
    response: {
      202: Nullable(RES_COMMENT_TREE_SCHEMA),
    },
  },

  DELETE_COMMENT: {
    params: REQ_COMMENT_PATH_PARAMS_SCHEMA,
    response: {
      204: Type.Object({}),
    },
  },

  LIKE_COMMENT: {
    params: REQ_COMMENT_PATH_PARAMS_SCHEMA,
    response: {
      200: RES_COMMENT_LIKED_SCHEMA,
    },
  },

  UNLIKE_COMMENT: {
    params: REQ_COMMENT_PATH_PARAMS_SCHEMA,
    response: {
      200: RES_COMMENT_LIKED_SCHEMA,
    },
  },
})
export default COMMENTS_SCHEMA

// static types

export type CommentsRequestMap = RouteRequestMap<typeof COMMENTS_SCHEMA>
export type CommentsResponseCodeMap = RouteResponseCodeMap<
  typeof COMMENTS_SCHEMA
>
