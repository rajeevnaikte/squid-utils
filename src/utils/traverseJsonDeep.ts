import { JsonArray, JsonObject, JsonValue } from 'type-fest';
import { isArray, isObjectLike } from 'lodash';

/**
 * Traverse deep the object keeping track of key path so far.
 * Invokes the consumer with key, value, fullKeyPath and the object where this key-value is in.
 * If consumer returns false, then it will not go deeper into the value, if the value was an object.
 * @param object
 * @param consumer
 * @param parentKey
 */
export function traverseJsonDeep<Data>(
  object: Data,
  consumer: (
    key: string | number, value: JsonValue, fullKeyPath: string, object: JsonObject | JsonArray
  ) => any,
  parentKey?: string,
): void
{
  if (isArray(object))
  {
    object.forEach((item, i) =>
    {
      const fullKeyPath = parentKey ? `${parentKey}[${i}]` : `[${i}]`;

      if (consumer(i, item, fullKeyPath, object) !== false)
      {
        traverseJsonDeep(item, consumer, fullKeyPath);
      }
    });
  }
  else if (isObjectLike(object))
  {
    const jsonObject = object as JsonObject;
    Object.keys(jsonObject).forEach((key) =>
    {
      const value = jsonObject[key] as JsonValue;
      const fullKeyPath = parentKey ? `${parentKey}.${key}` : key;

      if (consumer(key, value, fullKeyPath, object) !== false)
      {
        traverseJsonDeep(value, consumer, fullKeyPath);
      }
    });
  }
}

/**
 * Async version of {#traverseJsonDeep}
 * @see traverseJsonDeep
 */
export async function traverseJsonDeepAsync<Data>(
  object: Data,
  consumer: (
    key: string | number, value: JsonValue, fullKeyPath: string, object: JsonObject | JsonArray
  ) => Promise<boolean | void>,
  parentKey?: string,
): Promise<void>
{
  if (isArray(object))
  {
    for (let i = 0; i < object.length; i++)
    {
      const item = object[i];
      const fullKeyPath = parentKey ? `${parentKey}[${i}]` : `[${i}]`;

      if (await consumer(i, item, fullKeyPath, object) !== false)
      {
        await traverseJsonDeepAsync(item, consumer, fullKeyPath);
      }
    }
  }
  else if (isObjectLike(object))
  {
    const jsonObject = object as JsonObject;
    for (const key in jsonObject)
    {
      const value = jsonObject[key] as JsonValue;
      const fullKeyPath = parentKey ? `${parentKey}.${key}` : key;

      if (await consumer(key, value, fullKeyPath, object) !== false)
      {
        await traverseJsonDeepAsync(value, consumer, fullKeyPath);
      }
    }
  }
}
