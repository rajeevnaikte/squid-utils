export type Primitive = string | number | boolean | symbol | null | undefined

export type NonNullPrimitive = string | number | boolean | symbol

export type JsonObjectType = {
  [key: string]: JsonType | Primitive | (JsonType | NonNullPrimitive)[];
}

export type JsonArrayType = (JsonType | NonNullPrimitive)[]

export type JsonType = JsonObjectType | JsonArrayType
