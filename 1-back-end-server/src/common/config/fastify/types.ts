export type SchemaStruct<Root extends SchemaValue = 'object'> = {
  type: SchemaValue
  properties:
    | {
        [key: string]: SchemaProps | SchemaStruct
      }
    | SchemaArray
  example?: AnySchema
}

export type AnySchema = {
  [key: string]: any
}
export type SchemaValue = 'object' | 'array' | 'string' | 'boolean' | 'number'
export type SchemaProps<T extends SchemaValue = SchemaValue> = {
  type: SchemaValue
}
export type SchemaArray = SchemaProps[] | SchemaStruct[]
