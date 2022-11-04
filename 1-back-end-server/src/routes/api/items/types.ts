import { RequestGenericInterface } from 'fastify/types/request'
import { Static } from '@sinclair/typebox'
import {
  REQ_ITEM_CREATE_BODY_SCHEMA,
  REQ_ITEM_LIST_QUERYSTRING_SCHEMA,
  REQ_ITEM_PARAMS_SCHEMA,
  REQ_ITEM_UPDATE_BODY_SCHEMA,
} from './schema.js'

export interface ItemsCreateRequest extends RequestGenericInterface {
  Body: ItemCreateBody
}
export type ItemCreateBody = Static<typeof REQ_ITEM_CREATE_BODY_SCHEMA>

export interface ItemsReadRequest extends RequestGenericInterface {
  Querystring: ItemListQuerystring
  Params: ItemParams
}
export type ItemListQuerystring = Static<
  typeof REQ_ITEM_LIST_QUERYSTRING_SCHEMA
>

export interface ItemsUpdateRequest extends RequestGenericInterface {
  Params: ItemParams
  Body: ItemUpdateBody
}
export type ItemUpdateBody = Static<typeof REQ_ITEM_UPDATE_BODY_SCHEMA>

export interface ItemsDeleteRequest extends RequestGenericInterface {
  Params: ItemParams
}

export interface ItemLikeRequest {
  Params: ItemParams
}

export interface UnlikeItemRequest {
  Params: ItemParams
}

export type ItemParams = Static<typeof REQ_ITEM_PARAMS_SCHEMA>
