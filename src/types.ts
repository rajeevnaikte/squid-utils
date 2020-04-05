export type JsonType = {
  [key: string]: JsonType |
    string | number | boolean | symbol |
    (JsonType | string | number | boolean | symbol)[] |
    null |
    undefined;
} | (JsonType | string | number | boolean | symbol)[]
