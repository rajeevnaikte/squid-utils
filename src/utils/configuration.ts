export const loadConfigs = <T>(configs: T): T => {
  const envValues = Object.keys(configs).filter(key => process.env[key])
    .reduce((map: any, key) => {
      map[key] = process.env[key];
      return map;
    }, {});
  Object.assign(configs, envValues);
  return configs
};
