import { RequestGenericInterface } from 'fastify/types/request'
import { ItemWriteBody } from './schema.js'

export interface ItemWriteRequest extends RequestGenericInterface {
  Body: ItemWriteBody
}
