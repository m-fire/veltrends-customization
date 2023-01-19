import { Type } from '@sinclair/typebox'

export const PAGINATION_OPTION_SCHEMA = Type.Object({
  cursor: Type.Optional(Type.Integer()),
  userId: Type.Optional(Type.Integer()),
  limit: Type.Optional(Type.Integer()),
})
export const RES_EMPTY_LIST_SCHEMA = Type.Array(Type.Void())
export const RES_EMPTY_OBJECT_SCHEMA = Type.Undefined()

/* Error schema */

export const ERROR_UNAUTHORIZED_SCHEMA = Type.Object(
  {
    isExpiredToken: Type.Boolean(),
  },
  {
    example: {
      isExpiredToken: true,
    },
  },
)
