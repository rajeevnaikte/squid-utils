import { JsonArray, JsonObject, JsonValue } from 'type-fest';

export type NonNullPrimitive = string | number | boolean | symbol

export type JsonObjectType = JsonObject;

export type JsonArrayType = JsonArray;

export type JsonType = JsonValue;
