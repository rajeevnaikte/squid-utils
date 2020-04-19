export type Primitive = string | number | boolean | symbol | null | undefined

export type NonNullPrimitive = string | number | boolean | symbol

export type JsonType = {
  [key: string]: JsonType | Primitive | (JsonType | NonNullPrimitive)[];
} | (JsonType | NonNullPrimitive)[]
