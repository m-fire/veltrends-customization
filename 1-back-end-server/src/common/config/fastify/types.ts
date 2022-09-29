export type SchemaStruct<
  Props extends SchemaDataProp = { type: 'string' },
  RootType extends SchemaDataType = 'object',
> = {
  type: RootType
  properties: {
    [key: string]: Props
  }
}
type SchemaDataProp = { type: SchemaDataType }
type SchemaDataType = 'object' | 'string' | 'number'
