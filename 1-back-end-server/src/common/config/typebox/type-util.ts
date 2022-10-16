import { Type, TSchema } from '@sinclair/typebox'

// ref: https://github.com/sinclairzx81/typebox#generic

export const Nullable = <T extends TSchema>(type: T) =>
  Type.Union([type, Type.Null()])
