export type SwaggerSchema<
  Props extends
    | SwaggerSchema
    | SchemaStructType
    | SchemaValueProp = SchemaValueProp,
  RootType extends SchemaStructType = 'object',
> = {
  type: RootType
  properties: RootType extends 'object'
    ? {
        [key: string]: Props
      }
    : RootType extends 'object'
    ? [SchemaValueProp] | [SwaggerSchema<SchemaValueProp, 'object' | 'array'>]
    : never
  example?: SwaggerExample
}
type SwaggerExample = {
  [key: string]: SchemaValueProp | SwaggerExample
}
type SchemaValueProp = { type: SchemaValueType }
type SchemaValueType = 'string' | 'number'
type SchemaStructType = 'object' | 'array'
