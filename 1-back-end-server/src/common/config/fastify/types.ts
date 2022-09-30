export type SwaggerSchema<Root extends SchemaValue = 'object'> = {
  type: SchemaValue
  properties:
    | {
        [key: string]: SchemaProps | SwaggerSchema
      }
    | SchemaArray
  example?: SwaggerExample
}

type SwaggerExample = {
  [key: string]: SchemaValue | SwaggerExample
}
export type SchemaValue = 'object' | 'array' | 'string' | 'number'
export type SchemaProps<T extends SchemaValue = SchemaValue> = {
  type: SchemaValue
}
export type SchemaArray = SchemaProps[] | SwaggerSchema[]
