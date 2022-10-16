import { Type } from '@sinclair/typebox'
import { Nullable } from './type-util.js'

export const PAGINATION_OPTION_SCHEMA = Type.Object({
  limit: Type.Optional(Nullable(Type.Integer())),
  cursor: Type.Optional(Nullable(Type.Integer())),
})
export const RES_EMPTY_LIST_SCHEMA = Type.Array(Type.Void())
export const RES_EMPTY_OBJECT_SCHEMA = Type.Undefined()
