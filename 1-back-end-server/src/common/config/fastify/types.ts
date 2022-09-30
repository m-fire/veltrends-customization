export type SchemaStruct<Root extends SchemaValue = 'object'> = {
  type: SchemaValue
  properties:
    | {
        [key: string]: SchemaProps | SchemaStruct
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
export type SchemaArray = SchemaProps[] | SchemaStruct[]
