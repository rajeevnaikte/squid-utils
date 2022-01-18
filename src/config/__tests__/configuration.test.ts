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

  describe('config value types', () => {
    test('boolean', () => {
      process.env.WATCH = 'true';
      const Config = loadConfigs({ WATCH: false });
      expect(Config.WATCH).toEqual(true);
    });

    test('number', () => {
      process.env.WATCH = '1';
      const Config = loadConfigs({ WATCH: 2 });
      expect(Config.WATCH).toEqual(1);
    });

    test('json', () => {
      process.env.WATCH = '{ "hello": "world" }';
      const Config = loadConfigs({ WATCH: {} });
      expect(Config.WATCH).toEqual({ hello: 'world' });
    });

    test('string', () => {
      process.env.WATCH = '{ "hello": "world" }';
      const Config = loadConfigs({ WATCH: '' });
      expect(Config.WATCH).toEqual('{ "hello": "world" }');
    });
  });
});
