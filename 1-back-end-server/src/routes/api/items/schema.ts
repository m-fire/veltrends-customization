import { FastifySchema } from 'fastify'
import { Static, Type } from '@sinclair/typebox'

const ITEM_WRITE_SCHEMA = Type.Object({
  title: Type.String(),
  body: Type.Optional(Type.String()),
  link: Type.String(),
  tags: Type.Array(Type.String()),
})
export type ItemWriteBody = Static<typeof ITEM_WRITE_SCHEMA>

export const ITEMS_POST_SCHEMA: FastifySchema = {
  tags: ['item'],
  body: ITEM_WRITE_SCHEMA,
}
