import { Type } from '@sinclair/typebox'
import { RES_AUTH_USER_INFO_SCHEMA } from '../auth/schema.js'
import {
  createAppErrorSchema,
  createFastifySchemaMap,
} from '../../../common/config/typebox/schema-util.js'
import { ERROR_UNAUTHORIZED_SCHEMA } from '../../../common/config/typebox/common-schema.js'

export const ME_SCHEMA = createFastifySchemaMap({
  GET_ACCOUNT: {
    tags: ['me'],
    response: {
      200: RES_AUTH_USER_INFO_SCHEMA,
      401: createAppErrorSchema('Unauthorized', ERROR_UNAUTHORIZED_SCHEMA),
    },
  },
  CHANGE_PASSWORD: {
    tags: ['me'],
    body: Type.Object({
      oldPassword: Type.String(),
      newPassword: Type.String(),
    }),
    response: {
      202: Type.Null(),
      // 새로운 패스워드 양식오류
      400: createAppErrorSchema('BadRequest'),
      401: createAppErrorSchema('Unauthorized', ERROR_UNAUTHORIZED_SCHEMA),
      // 이전 패스워드 불일치
      403: createAppErrorSchema('Forbidden'),
    },
  },
  UNREGISTER: {
    tags: ['me'],
    response: {
      202: Type.Null(),
    },
  },
})
