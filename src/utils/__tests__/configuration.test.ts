import { loadConfigs } from '../configuration';
import * as json from './config.json';

describe('configuration', () => {
  test('default config', () => {
    delete process.env.ROOT_DIR;
    const Config = loadConfigs({ ROOT_DIR: '.' });
    expect(Config.ROOT_DIR).toEqual('.');
  });

  test('config from user', () => {
    const Config = loadConfigs({ ROOT_DIR: 'test' });
    expect(Config.ROOT_DIR).toEqual('test');
  });

  test('config from env higher priority than user', () => {
    process.env.ROOT_DIR = 'test-env';
    const Config = loadConfigs({ ROOT_DIR: 'test' });
    expect(Config.ROOT_DIR).toEqual('test-env');
  });

  test('config from json', () => {
    const Config = loadConfigs(json);
    expect(Config.ROOT).toEqual(['']);
  });
});