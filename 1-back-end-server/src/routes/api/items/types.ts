import { RequestGenericInterface } from 'fastify/types/request'
import { Static } from '@sinclair/typebox'
import {
  REQ_ITEM_CREATE_BODY_SCHEMA,
  REQ_ITEM_READ_PARAMS_SCHEMA,
} from './schema.js'

export interface ItemCreateRequest extends RequestGenericInterface {
  Body: ItemCreateBody
}
export type ItemCreateBody = Static<typeof REQ_ITEM_CREATE_BODY_SCHEMA>

export interface ItemReadRequest extends RequestGenericInterface {
  Params: ItemReadParams
}
export type ItemReadParams = Static<typeof REQ_ITEM_READ_PARAMS_SCHEMA>
