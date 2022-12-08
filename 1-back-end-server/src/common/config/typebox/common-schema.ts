import { Type } from '@sinclair/typebox'
import { Nullable } from './type-util.js'

export const PAGINATION_OPTION_SCHEMA = Type.Object({
  limit: Type.Optional(Nullable(Type.Integer({ default: 20 }))),
  cursor: Type.Optional(Nullable(Type.Integer({ default: 43 }))),
  userId: Type.Optional(Nullable(Type.Integer({ default: 16 }))),
})
export const RES_EMPTY_LIST_SCHEMA = Type.Array(Type.Void())
export const RES_EMPTY_OBJECT_SCHEMA = Type.Undefined()

/* Error schema */

export const ERROR_PAYLOAD_EXPIRED_SCHEMA = Type.Object(
  {
    isExpiredToken: Type.Boolean(),
  },
  {
    example: {
      isExpiredToken: true,
    },
  },
)
