import { RequestGenericInterface } from 'fastify/types/request'
import { Static } from '@sinclair/typebox'
import { ITEM_CREATE_SCHEMA } from './schema'

export interface ItemCreateRequest extends RequestGenericInterface {
  Body: ItemCreateBody
}
export type ItemCreateBody = Static<typeof ITEM_CREATE_SCHEMA>
