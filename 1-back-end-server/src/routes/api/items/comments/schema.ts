import { Type } from '@sinclair/typebox'
import { Nullable } from '../../../../common/config/typebox/type-util.js'
import { createFastifySchemaMap } from '../../../../common/config/typebox/schema-util.js'
import ITEMS_SCHEMA from '../schema.js'

const REQ_COMMENT_CREATE_BODY_SCHEMA = Type.Object({
  text: Type.String(),
  parentCommentId: Nullable(Type.Integer()),
})

const REQ_COMMENT_PATH_PARAMS_SCHEMA = Type.Object({
  id: Type.Integer(),
  commentId: Type.Integer(),
})

const REQ_COMMENT_UPDATE_BODY_SCHEMA = Type.Object({
  text: Type.String(),
})

const COMMENTS_SCHEMA = createFastifySchemaMap({
  CREATE_COMMENT: {
    params: ITEMS_SCHEMA.GET_ITEM.params,
    body: REQ_COMMENT_CREATE_BODY_SCHEMA,
  },
  GET_COMMENT_LIST: {
    params: ITEMS_SCHEMA.GET_ITEM.params,
  },
  GET_SUBCOMMENT_LIST: {
    params: REQ_COMMENT_PATH_PARAMS_SCHEMA,
  },
  DELETE_COMMENT: {
    params: REQ_COMMENT_PATH_PARAMS_SCHEMA,
  },
  UPDATE_COMMENT: {
    params: REQ_COMMENT_PATH_PARAMS_SCHEMA,
    body: REQ_COMMENT_UPDATE_BODY_SCHEMA,
  },
  LIKE_COMMENT: {
    params: REQ_COMMENT_PATH_PARAMS_SCHEMA,
  },
  UNLIKE_COMMENT: {
    params: REQ_COMMENT_PATH_PARAMS_SCHEMA,
  },
} as const)

export default COMMENTS_SCHEMA
