import config from './config';

const globals = () => {
  let env = {};
  if (config.envPrefix) {
    Object.keys(process.env).filter(key =>
      key.indexOf(config.envPrefix) === 0).forEach((key) => {
        env[key] = process.env[key];
      });
  } else {
    env = { ...process.env };
  }
  return {
    env,
  };
};

export default globals();
