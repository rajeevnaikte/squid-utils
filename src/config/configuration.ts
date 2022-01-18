/**
 * Takes given configs JSON data and finds if there are any key value has been defined in
 * env. If so will override those JSON key-value with the env value.
 * @param configs
 */
import { traverseJsonDeep } from '../utils/traverseJsonDeep';
import { JsonValue } from 'type-fest';
import { cloneDeep, isNil } from 'lodash';

type ValueProvider = (fullKeyPath: string, key: string | number, value: JsonValue) => JsonValue | undefined;
type AsyncValueProvider = (fullKeyPath: string, key: string | number, value: JsonValue) => Promise<JsonValue | undefined>;

type ConfigLoader = <T>(configs: T) => T;
type AsyncConfigLoader = <T>(configs: T) => Promise<T>;

export function buildConfigLoader(valueProviders: (ValueProvider | AsyncValueProvider)[]): ConfigLoader | AsyncConfigLoader
{
  const setValue = (overrideValue: JsonValue | undefined, key: string | number, value: JsonValue, object: any) =>
  {
    if (['boolean', 'number', 'object'].includes(typeof value))
    {
      object[key] = JSON.parse(overrideValue as any);
    }
    else
    {
      object[key] = overrideValue;
    }
  };

  if (valueProviders.some(valueProvider => valueProvider.constructor.name === 'AsyncFunction'))
  {
    return async <T>(configs: T) =>
    {
      configs = cloneDeep(configs);
      traverseJsonDeep(configs, async (key, value, fullKeyPath, object: any) =>
      {
        for (const valueProvider of valueProviders)
        {
          const overrideValue = await (valueProvider as AsyncValueProvider)(fullKeyPath, key, value);
          if (!isNil(overrideValue))
          {
            setValue(overrideValue, key, value, object);
            break;
          }
        }
      });
      return configs;
    };
  }
  return <T>(configs: T) =>
  {
    configs = cloneDeep(configs);
    traverseJsonDeep(configs, (key, value, fullKeyPath, object: any) =>
    {
      for (const valueProvider of valueProviders)
      {
        const overrideValue = (valueProvider as ValueProvider)(fullKeyPath, key, value);
        if (!isNil(overrideValue))
        {
          setValue(overrideValue, key, value, object);
          break;
        }
      }
    });
    return configs;
  };
}

const EnvValueProvider = (fullKeyPath: string) => process.env[fullKeyPath];

export function loadConfigs<T>(configs: T)
{
  return (buildConfigLoader([EnvValueProvider]) as ConfigLoader)(configs);
}
