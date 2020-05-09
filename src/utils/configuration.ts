/**
 * Takes given configs JSON data and finds if there are any key value has been defined in
 * env. If so will override those JSON key-value with the env value.
 * @param configs
 */
export const loadConfigs = <T>(configs: T): T => {
  const envValues = Object.keys(configs).filter(key => process.env[key])
    .reduce((map: any, key) => {
      map[key] = process.env[key];
      return map;
    }, {});
  Object.assign(configs, envValues);
  return configs
};
