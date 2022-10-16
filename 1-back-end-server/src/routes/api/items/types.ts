import { RequestGenericInterface } from 'fastify/types/request'
import { Static } from '@sinclair/typebox'
import {
  REQ_ITEM_CREATE_BODY_SCHEMA,
  REQ_ITEM_READ_PARAMS_SCHEMA,
  REQ_ITEM_READ_QUERYSTRING_SCHEMA,
  REQ_ITEM_UPDATE_BODY_SCHEMA,
} from './schema.js'

export interface ItemsCreateRequest extends RequestGenericInterface {
  Body: ItemCreateBody
}
export type ItemCreateBody = Static<typeof REQ_ITEM_CREATE_BODY_SCHEMA>

export interface ItemsReadRequest extends RequestGenericInterface {
  Querystring: ItemReadQuerystring
  Params: ItemReadParams
}
export type ItemReadQuerystring = Static<
  typeof REQ_ITEM_READ_QUERYSTRING_SCHEMA
>
export type ItemReadParams = Static<typeof REQ_ITEM_READ_PARAMS_SCHEMA>

export interface ItemsUpdateRequest extends RequestGenericInterface {
  Params: ItemReadParams
  Body: ItemUpdateBody
}
export type ItemUpdateBody = Static<typeof REQ_ITEM_UPDATE_BODY_SCHEMA>
