import { FastifySchema } from 'fastify'
import { Type } from '@sinclair/typebox'

export const ITEM_CREATE_SCHEMA = Type.Object({
  title: Type.String(),
  body: Type.String(),
  link: Type.String(),
  tags: Type.Array(Type.String()),
})

export const ITEMS_POST_SCHEMA: FastifySchema = {
  tags: ['item'],
  body: ITEM_CREATE_SCHEMA,
}
