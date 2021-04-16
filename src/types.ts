import { JsonArray, JsonObject, JsonValue } from 'type-fest';

export type NonNullPrimitive = string | number | boolean | symbol

export type JsonObjectType = JsonObject;

export type JsonArrayType = JsonArray;

export type JsonType = JsonValue;

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type Xor<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : (T | U);
